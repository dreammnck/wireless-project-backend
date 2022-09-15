import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const init = async () => {
  try {
    await prisma.$connect();
  } catch {
    process.exit(1);
  }
};

const createUser = async () => {
  const data = [];

  for (let index = 1; index <= 10; index++) {
    data.push({
      username: index <= 5 ? `doctor${index}` : `nurse${index}`,
      password: bcrypt.hashSync(`password${index}`, Number(process.env.SALT)),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: index <= 5 ? Role.DOCTOR : Role.NURSE,
    });
  }
  await prisma.user.createMany({ data });
};

const createFloor = async () => {
  const data = [];

  for (let index = 1; index <= 10; index++) {
    data.push({ name: `floor${index}` });
  }

  await prisma.floor.createMany({ data });
};

const createRoom = async () => {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 14; j++) {
      data.push({
        name: `${i < 10 ? 0 : ''}${i}${j < 10 ? 0 : ''}${j}`,
        floorId: i,
        isTrigger: Math.random() <= 0.5 ? false : true,
      });
    }
  }

  await prisma.room.createMany({ data });
};

const createPatient = async () => {
  const data = [];

  for (let i = 1; i <= 140; i++) {
    data.push({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      age: Math.floor(Math.random() * 80),
      roomId: i,
    });
  }

  await prisma.patient.createMany({ data });
};

const createMedicalHistory = async () => {
  const doctors = (
    await prisma.user.findMany({ where: { role: Role.DOCTOR } })
  ).map((doctor) => {
    return `${doctor.firstname} ${doctor.lastname}`;
  });
  const data = [];

  for (let i = 1; i <= 140; i++) {
    const index = Math.floor(Math.random() * 5);
    data.push({
      medicalHistory: faker.lorem.sentence(),
      doctor: doctors[index],
      patientId: i,
    });
  }

  await prisma.medicleHistory.createMany({ data });
};

const main = async () => {
  await init();
  await createUser();
  await createFloor();
  await createRoom();
  await createPatient();
  await createMedicalHistory();
};

main()
  .then(() => {
    console.log('successfully seeding');
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
