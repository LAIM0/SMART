import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { UserModule } from "src/User/user.module"
import { AuthService } from "./auth.service"
import { LocalStrategy } from "./local.strategy"
import { SessionSerializer } from "./session.serializer"

@Module({
  imports: [UserModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}