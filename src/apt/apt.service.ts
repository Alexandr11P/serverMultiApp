import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';



@Injectable()
export class AptService {
    constructor(private prisma: PrismaService) { }
    async getApt() {
        const apt = await this.prisma.apt.findMany()
        const img = await this.prisma.img.findMany()
        return apt.map((e) => { return { gallery: img.filter((el) => el.folder === e.folder).map(e => e.name), ...e } })
    }
}