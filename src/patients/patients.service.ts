import { CreatePatientInfusionHistoryDto } from './dto/create-patient-infusion-history.dto';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreatePatientMedicalHistoryDto,
  UpdatePatientInfusionHistoryDto,
  UpdatePatientMedicalHistoryDto,
} from './dto';
import dayjs from 'dayjs';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  public async findById(id: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { address: true, infusionHistory: true, medicalHostory: true },
    });
    if (!patient) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'Patient Not Found',
      });
    }

    return patient;
  }

  public async createMedicalHistory(
    patientId: number,
    doctorUsername: string,
    createPatientMedicalHistoryDto: CreatePatientMedicalHistoryDto,
  ) {
    await this.findById(patientId);
    try {
      const doctor = await this.findUserByUsername(doctorUsername);
      const medicalHistory = await this.prisma.medicleHistory.create({
        data: {
          doctor: `${doctor.firstname} ${doctor.lastname}`,
          patientId,
          ...createPatientMedicalHistoryDto,
        },
      });
      return medicalHistory;
    } catch (_) {
      throw new BadRequestException({
        errorCode: HttpStatus.BAD_REQUEST,
        message: `Invalid input`,
      });
    }
  }

  public async createInfusionHistory(
    patientId: number,
    nurseUsername: string,
    createPatientInfusionHistoryDto: CreatePatientInfusionHistoryDto,
  ) {
    const patient = await this.findById(patientId);
    try {
      const nurse = await this.findUserByUsername(nurseUsername);
      await this.prisma.infusionHistory.updateMany({
        where: { isCompleted: false },
        data: { isCompleted: true },
      });
      const createInfusionHistory = await this.prisma.infusionHistory.create({
        data: {
          nurse: `${nurse.firstname} ${nurse.lastname}`,
          patientId,
          ...createPatientInfusionHistoryDto,
        },
      });
      await this.prisma.room.update({
        where: { id: patient.roomId },
        data: { isTrigger: false },
      });
      return createInfusionHistory;
    } catch (_) {
      throw new BadRequestException({
        errorCode: HttpStatus.BAD_REQUEST,
        message: `Invalid input`,
      });
    }
  }

  public async updateMedicalHistory(
    patientId: number,
    doctorUsername: string,
    updatePatientMedicalHistoryDto: UpdatePatientMedicalHistoryDto,
  ) {
    const { id, ...rest } = updatePatientMedicalHistoryDto;
    const medicalHistory = await this.prisma.medicleHistory.findUnique({
      where: { id },
    });
    if (!medicalHistory) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'Medical history Not Found',
      });
    }
    if (medicalHistory.patientId !== patientId) {
      throw new ForbiddenException({
        errorCode: HttpStatus.FORBIDDEN,
        message: `Patient'id not belong to medical history`,
      });
    }

    try {
      const doctor = await this.findUserByUsername(doctorUsername);
      const updatedMedicalHistory = await this.prisma.medicleHistory.update({
        where: { id },
        data: {
          updatedDate: dayjs().toDate(),
          doctor: `${doctor.firstname} ${doctor.lastname}`,
          ...rest,
        },
      });
      return updatedMedicalHistory;
    } catch (_) {
      throw new BadRequestException({
        errorCode: HttpStatus.BAD_REQUEST,
        message: `Invalid input`,
      });
    }
  }

  public async updateInfusionHistory(
    patientId: number,
    nurseUsername: string,
    updatePatientInfusionHistoryDto: UpdatePatientInfusionHistoryDto,
  ) {
    const { id, ...rest } = updatePatientInfusionHistoryDto;
    const patient = await this.findById(patientId);
    const infusionHistory = patient.infusionHistory.find((history) => {
      return history.id === id;
    });
    if (!infusionHistory) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'Infusion history Not Found',
      });
    }

    if (infusionHistory.patientId !== patientId) {
      throw new ForbiddenException({
        errorCode: HttpStatus.FORBIDDEN,
        message: `Patient'id not belong to infusion history`,
      });
    }

    try {
      const nurse = await this.findUserByUsername(nurseUsername);
      const updateInfusionHistory = await this.prisma.infusionHistory.update({
        where: { id },
        data: {
          updatedDate: dayjs().toDate(),
          nurse: `${nurse.firstname} ${nurse.lastname}`,
          ...rest,
        },
      });
      await this.prisma.room.update({
        where: { id: patient.roomId },
        data: { isTrigger: false },
      });
      return updateInfusionHistory;
    } catch (_) {
      throw new BadRequestException({
        errorCode: HttpStatus.BAD_REQUEST,
        message: `Invalid input`,
      });
    }
  }

  public async getMedicalHistoryByPatientId(id: number) {
    const data = await this.prisma.medicleHistory.findMany({
      where: { patientId: id },
    });
    return data;
  }

  public async getInfusionHistory(id: number) {
    const data = await this.prisma.infusionHistory.findMany({
      where: { patientId: id },
      orderBy: { createdDate: 'desc' },
    });
    return data;
  }

  private async findUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new NotFoundException({
        errorCode: HttpStatus.NOT_FOUND,
        message: 'User not Found',
      });
    }
    return user;
  }
}
