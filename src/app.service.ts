import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMahasiswaDTO } from './dto/create-mahasiswa.dto';
import PrismaService from './prisma';
import { compareSync, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class AppService {

  //kalau sebelumnya tidak ada ini, jangan masukkan private readonly prisma.....
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService) {

  }



  async register(data: RegisterUserDTO) {
    try {

      const user = await this.prisma.user.findFirst({
        where: {
          username: data.username
        }
      })
      if (user != null) throw new BadRequestException("Username ini Sudah Digunakan")

      const hash = hashSync(data.password, 10)

      const newUser = await this.prisma.user.create({
        data: {
          username: data.username,
          password: hash,
        }
      })

      return newUser

    } catch (err) {
      if (err instanceof HttpException) throw err
      throw new InternalServerErrorException("Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit")
    }
  }

  async auth(user_id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: user_id
        }
      })

      if (user == null) throw new NotFoundException("User Tidak Ditemukan")

      return user

    } catch (err) {

      if (err instanceof HttpException) throw err

      throw new InternalServerErrorException("Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit")

    }
  }


  async login(data: RegisterUserDTO) {

    try {

      const user = await this.prisma.user.findFirst({
        where: {
          username: data.username
        }
      })

      if (user == null) throw new NotFoundException("User Tidak Ditemukan")

      if (compareSync(data.password, user.password) == false) throw new BadRequestException("Password Salah")

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role
      }

      const token = await this.jwtService.signAsync(payload)

      return {
        token: token,
        user
      }

    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) throw err

      throw new InternalServerErrorException("Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit")
    }

  }








  getHello(): string {
    return 'Hello World!';
  }

  getMahasiswa() {
    return this.prisma.mahasiswa.findMany()
  }

  async addMahasiswa(data: CreateMahasiswaDTO) {
    const mahasiswa =
      await this.prisma.mahasiswa.findFirst({
        where: {
          nim: data.nim
        }
      })

    if (mahasiswa != null) throw new NotFoundException("Mahasiswa dengan nim ini sudah ada")

    await this.prisma.mahasiswa.create({
      data: data
    });

    return this.prisma.mahasiswa.findMany()
  }

  async getMahasiswByNim(nim: string) {
    const mahasiswa =
      await this.prisma.mahasiswa.findFirst({
        where: {
          nim: nim
        }
      })

    if (mahasiswa == null) throw new NotFoundException("Tidak Menemukan NIM")
    return mahasiswa
  }

  async menghapusMahasiswa(nim: string) {
    const mahasiswa =
      await this.prisma.mahasiswa.findFirst({
        where: {
          nim: nim
        }
      })

    if (mahasiswa == null) throw new NotFoundException("Tidak Menemukan NIM")
    await this.prisma.mahasiswa.delete({
      where: {
        nim: nim
      }
    })

    return this.prisma.mahasiswa.findMany()

  }

}
