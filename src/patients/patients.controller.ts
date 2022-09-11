import { Body, HttpStatus, Patch, Post } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  CreatePatientInfusionHistoryDto,
  CreatePatientMedicalHistoryDto,
  UpdatePatientInfusionHistoryDto,
  UpdatePatientMedicalHistoryDto,
} from './dto';

@Controller('patient')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get(':id')
  async getOne(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const patient = await this.patientsService.findById(id);
    return res.json({ data: patient }).status(HttpStatus.OK);
  }

  @Post(':id/medical-history')
  async createMedicalHistory(
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    createMedicalHistoryDto: CreatePatientMedicalHistoryDto,
    @Res() res: Response,
  ) {
    const createdMedicalHistory =
      await this.patientsService.createMedicalHistory(
        id,
        createMedicalHistoryDto,
      );
    return res.json({ data: createdMedicalHistory }).status(HttpStatus.CREATED);
  }

  @Post(':id/infusion-history')
  async createInfusionHistory(
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    createInfusionHistoryDto: CreatePatientInfusionHistoryDto,
    @Res() res: Response,
  ) {
    const createdInfusionHistory =
      await this.patientsService.createInfusionHistory(
        id,
        createInfusionHistoryDto,
      );
    return res
      .json({ data: createdInfusionHistory })
      .status(HttpStatus.CREATED);
  }

  @Patch(':id/medical-history')
  async updateMedicalHistory(
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    updateMedicalHistoryDto: UpdatePatientMedicalHistoryDto,
    @Res() res: Response,
  ) {
    const updatePatientMedicalHistory =
      await this.patientsService.updateMedicalHistory(
        id,
        updateMedicalHistoryDto,
      );
    return res
      .json({ data: updatePatientMedicalHistory })
      .status(HttpStatus.CREATED);
  }

  @Patch(':id/infusion-history')
  async updateInfusionHistory(
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    updateInfusionHistoryDto: UpdatePatientInfusionHistoryDto,
    @Res() res: Response,
  ) {
    const updateInfusionHistory =
      await this.patientsService.updateInfusionHistory(
        id,
        updateInfusionHistoryDto,
      );
    return res.json({ data: updateInfusionHistory }).status(HttpStatus.CREATED);
  }
}
