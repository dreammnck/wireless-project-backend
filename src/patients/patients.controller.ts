import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { ExtendRequest } from './../types/request.type';
import { RolesGuard } from './../utils/guards/role.guard';
import { Body, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  CreatePatientInfusionHistoryDto,
  CreatePatientMedicalHistoryDto,
  UpdatePatientInfusionHistoryDto,
  UpdatePatientMedicalHistoryDto,
} from './dto';
import { Role } from 'src/types';

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get(':id')
  async getOne(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const patient = await this.patientsService.findById(id);
    const {address, infusionHistory, medicalHostory, ...rest} = patient;
    return res.json({ data: {address, ...rest} }).status(HttpStatus.OK);
  }

  @Get(':id/medical-history')
  async getMedicalHistory(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const medicalHistory =
      await this.patientsService.getMedicalHistoryByPatientId(id);
    return res.json({ data: medicalHistory }).status(HttpStatus.OK);
  }

  @Get(':id/infusion-history')
  async getInfusionHistory(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const infusionHistory = await this.patientsService.getInfusionHistory(id);
    return res.json({ data: infusionHistory }).status(HttpStatus.OK);
  }

  @UseGuards(new RolesGuard(Role.DOCTOR))
  @Post(':id/medical-history')
  async createMedicalHistory(
    @Req() req: ExtendRequest,
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    createMedicalHistoryDto: CreatePatientMedicalHistoryDto,
    @Res() res: Response,
  ) {
    const createdMedicalHistory =
      await this.patientsService.createMedicalHistory(
        id,
        req.user.username,
        createMedicalHistoryDto,
      );
    return res.json({ data: createdMedicalHistory }).status(HttpStatus.CREATED);
  }

  @UseGuards(new RolesGuard(Role.NURSE))
  @Post(':id/infusion-history')
  async createInfusionHistory(
    @Req() req: ExtendRequest,
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    createInfusionHistoryDto: CreatePatientInfusionHistoryDto,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    const createdInfusionHistory =
      await this.patientsService.createInfusionHistory(
        id,
        username,
        createInfusionHistoryDto,
      );
    return res
      .json({ data: createdInfusionHistory })
      .status(HttpStatus.CREATED);
  }

  @UseGuards(new RolesGuard(Role.DOCTOR))
  @Patch(':id/medical-history')
  async updateMedicalHistory(
    @Req() req: ExtendRequest,
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    updateMedicalHistoryDto: UpdatePatientMedicalHistoryDto,
    @Res() res: Response,
  ) {
    const updatePatientMedicalHistory =
      await this.patientsService.updateMedicalHistory(
        id,
        req.user.username,
        updateMedicalHistoryDto,
      );
    return res
      .json({ data: updatePatientMedicalHistory })
      .status(HttpStatus.CREATED);
  }

  @UseGuards(new RolesGuard(Role.NURSE))
  @Patch(':id/infusion-history')
  async updateInfusionHistory(
    @Req() req: ExtendRequest,
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    updateInfusionHistoryDto: UpdatePatientInfusionHistoryDto,
    @Res() res: Response,
  ) {
    const updateInfusionHistory =
      await this.patientsService.updateInfusionHistory(
        id,
        req.user.username,
        updateInfusionHistoryDto,
      );
    return res.json({ data: updateInfusionHistory }).status(HttpStatus.CREATED);
  }
}
