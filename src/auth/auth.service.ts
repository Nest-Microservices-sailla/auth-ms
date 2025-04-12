import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('AuthService')

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {
        super()
    }

    onModuleInit() {
        this.$connect()
        this.logger.log('MongoDb connected successfully')
    }

    async registerUser() {
        return 'User register ok'
    }

    loginUser() {
        return 'User Login ok'
    }

    validateToken() {
        return 'Validate Token ok'
    }
}
