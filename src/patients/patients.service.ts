import { CreatePatientInfusionHistoryDto } from './dto/create-patient-infusion-history.dto';
import { ForbiddenException, HttpStatus } from '@nestjs/common';
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
      select: { medicalHostory: true, infusionHistory: true },
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
    createPatientMedicalHistoryDto: CreatePatientMedicalHistoryDto,
  ) {
    await this.findById(patientId);
    const medicalHistory = await this.prisma.medicleHistory.create({
      data: { patientId, ...createPatientMedicalHistoryDto },
    });

    return medicalHistory;
  }

  public async createInfusionHistory(
    patientId: number,
    createPatientInfusionHistoryDto: CreatePatientInfusionHistoryDto,
  ) {
    await this.findById(patientId);
    const createInfusionHistory = await this.prisma.infusionHistory.create({
      data: { patientId, ...createPatientInfusionHistoryDto },
    });
    return createInfusionHistory;
  }

  public async updateMedicalHistory(
    patientId: number,
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
    const updatedMedicalHistory = await this.prisma.medicleHistory.update({
      where: { id },
      data: { updatedDate: dayjs().toDate(), ...rest },
    });
    return updatedMedicalHistory;
  }

  public async updateInfusionHistory(
    patientId: number,
    updatePatientInfusionHistoryDto: UpdatePatientInfusionHistoryDto,
  ) {
    const { id, ...rest } = updatePatientInfusionHistoryDto;
    const infusionHistory = await this.prisma.infusionHistory.findUnique({
      where: { id },
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

    const updateInfusionHistory = await this.prisma.infusionHistory.update({
      where: { id },
      data: { updatedDate: dayjs().toDate(), ...rest },
    });
    return updateInfusionHistory;
  }
}
