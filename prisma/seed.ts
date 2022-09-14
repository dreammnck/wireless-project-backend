import { PrismaClient, PatientClass } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const init = async () => {
  try {
    await prisma.$connect();
  } catch {
    process.exit(1);
  }
};

const createAdmin = async () => {
  await prisma.admin.createMany({
    data: [
      { username: 'admin', password: bcrypt.hashSync('password1', 5) },
      { username: 'superAdmin', password: bcrypt.hashSync('password2', 5) },
    ],
  });
};

const createFloor = async () => {
  await prisma.floor.createMany({
    data: [
      { name: 'floor1' },
      { name: 'floor2' },
      { name: 'floor3' },
      { name: 'floor4' },
      { name: 'floor5' },
    ],
  });
};

const createRoom = async () => {
  const data = [];
  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 5; j++) {
      data.push({ name: `${i}0${j}`, floorId: j });
    }
  }

  await prisma.room.createMany({ data });
};

const createPatient = async () => {
  const data = [];

  for (let i = 1; i <= 25; i++) {
    data.push({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      age: Math.floor(Math.random() * 80),
      roomId: i,
      class: i % 5 === 0 ? PatientClass.VIP : PatientClass.NORMAL,
    });
  }

  await prisma.patient.createMany({ data });
};

const createMedicalHistory = async () => {
  const doctors = [
    faker.name.firstName(),
    faker.name.firstName(),
    faker.name.firstName(),
    faker.name.firstName(),
    faker.name.firstName(),
  ];
  const data = [];

  for (let i = 1; i <= 25; i++) {
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
  await createAdmin();
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
