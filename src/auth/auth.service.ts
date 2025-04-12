import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService')

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) { }

    async registerUser() {
        return  'User register ok'
    }

    loginUser() {
        return 'User Login ok'
    }

    validateToken() {
        return 'Validate Token ok'
    }
}
