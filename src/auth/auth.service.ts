import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from 'generated/prisma';
import { LoginUserDto, RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';




@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('AuthService')

    constructor(

    ) {
        super()
    }

    onModuleInit() {
        this.$connect()
        this.logger.log('MongoDb connected successfully')
    }

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
                token: 'ABC'
            }

        } catch (error) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: error.message,
            })
        }
    }

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
                token: 'ABC'
            }

        } catch (error) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: error.message,
            })
        }
    }

    validateToken() {
        return 'Validate Token ok'
    }
}
