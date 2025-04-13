import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from 'generated/prisma';
import { LoginUserDto, RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadAuth } from './interfaces/jwt-payload.interface';
import { envs } from 'src/config';




@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('AuthService')

    constructor(
        private readonly jwtServices: JwtService
    ) {
        super()
    }

    //Todo ---    DB CONNECTION      ------

    onModuleInit() {
        this.$connect()
        this.logger.log('MongoDb connected successfully')
    }

    //Todo ---    REGISTER      ------

    async registerUser(registerUserDto: RegisterUserDto) {

        const { name, lastName, email, password } = registerUserDto

        try {

            const user = await this.user.findUnique({
                where: {
                    email
                }
            })

            if (user) {
                throw new RpcException({
                    status: HttpStatus.NOT_FOUND,
                    message: 'User already exists'
                })
            }

            const newUser = await this.user.create({
                data: {
                    name: name,
                    lastName: lastName,
                    email: email,
                    password: bcrypt.hashSync(password, 10)
                }
            })

            const { password: __, ...rest } = newUser

            return {
                user: rest,
                token: await this.signJWT(rest)
            }

        } catch (error) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: error.message,
            })
        }
    }

    //Todo ---    LOGIN      ------

    async loginUser(loginUserDto: LoginUserDto) {

        const { email, password } = loginUserDto

        try {

            const user = await this.user.findUnique({
                where: { email }
            })

            if (!user) {
                throw new RpcException({
                    status: HttpStatus.NOT_FOUND,
                    message: 'User not found'
                })
            }

            const isValidPassword = bcrypt.compareSync(password, user.password)

            if (!isValidPassword) {
                throw new RpcException({
                    status: HttpStatus.NOT_FOUND,
                    message: 'User/Password not valid'
                })
            }

            const { password: __, ...rest } = user

            return {
                user: rest,
                token: await this.signJWT(rest)
            }

        } catch (error) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: error.message,
            })
        }
    }

    //Todo ---   Validador de token   --------

    async validateToken(token: string) {

        try {

            const {sub, iat, exp, ...user} = this.jwtServices.verify(token, {
                secret: envs.jwtSecret,
            })

            return {
                user: user, 
                token: await this.signJWT(user)
            }

        } catch (error) {
            throw new RpcException({
                status: HttpStatus.UNAUTHORIZED,
                message: 'Invalid token'
            })
        }
    }

    //Todo ---    JWT      ------

    async signJWT(payload: JwtPayloadAuth) {
        return this.jwtServices.sign(payload)
    }

}
