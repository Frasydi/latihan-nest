import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreateMahasiswaDTO } from './dto/create-mahasiswa.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './entity/user.entity';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { UserDecorator } from './user.decorator';



@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Post("register")
  @ApiBody({ type: RegisterUserDTO })
  register(@Body() user: RegisterUserDTO) {
    return this.appService.register(user)
  }

 



  @Get()
  getHello(): string {
    return this.appService.getHello();
  }



  @Get("mahasiswa")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getMahasiswa() {
    return this.appService.getMahasiswa();
  }



  @Get("mahasiswa/:nim")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getMahasiswaByNim(@Param("nim") nim: string) {
    return this.appService.getMahasiswByNim(nim)
  }

  @Get("/auth")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  auth(@UserDecorator() user: User) {
    return user
  }


  //untuk yang sudah hiraukan dulu, tunggu smpai ada arahan. Selain itu lanjut
  @Post("login")
  @ApiBody({
    type: RegisterUserDTO
  })
  async login(@Body() data: RegisterUserDTO,
    //untuk yang sudah tugasnya ketikkan ini
    @Res({ passthrough: true }) res: Response) {
    const result = await this.appService.login(data)
    res.cookie("token", result.token)

    result.user = plainToInstance(User, result.user)

    return result
  }




  @Post("mahasiswa")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateMahasiswaDTO })
  createMahasiswa(@Body() data: CreateMahasiswaDTO) {
    return this.appService.addMahasiswa(data)
  }

  @Delete("mahasiswa/:nim")
  deleteMahasiswa(@Param("nim") nim: string) {
    return this.appService.menghapusMahasiswa(nim)
  }


}
