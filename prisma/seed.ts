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

  for (let index = 1; index <= 11; index++) {
    data.push({ name: `floor${index}` });
  }

  await prisma.floor.createMany({ data });
};

const createRoom = async () => {
  const data = [];
  for (let i = 1; i <= 11; i++) {
    for (let j = 1; j <= 14; j++) {
      const isTrigger = i == 1 && j <= 6 ? false : Math.random() <= 0.5 ? false : true;
      data.push({
        name: `${i < 10 ? 0 : ''}${i}${j < 10 ? 0 : ''}${j}`,
        floorId: i,
        isTrigger: isTrigger,
        estimateFinishTime: isTrigger
          ? new Date(
              new Date().getTime() + Math.random() * 5 * 60 * 60000,
            ).toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
          : '',
      });
    }
  }

  await prisma.room.createMany({ data });
};

const createAddress = async () => {
  const province = [
    'Bangkok',
    'Samut Prakan',
    'Nonthaburi',
    'Rayong',
    'Saraburi',
  ];
  const district = [
    ['Bang Su', 'Min Buri', 'Bang Rak', 'Phaya Thai', 'Pahtum Wan'],
    [
      'Phra Samut Chedi',
      'Bang Phli',
      'Bang Saotong',
      '	Muang Samut Prakan',
      'Bang Bo',
    ],
    ['Muang Nonthaburi', 'Bang Bua Thong', 'Pak Kret', 'Bang Yai', 'Sai Noi'],
    ['Muang Rayong', 'Klaeng', 'Khao Chamao', 'Ban Khai', 'Ban Chang'],
    [
      'Muang Saraburi',
      'Chaloem Phakiat',
      'Kaeng Khoi',
      'Phra Phutthabat',
      'Phra Phutthabat',
    ],
  ];
  const data = [];

  for (let i = 1; i <= 154; i++) {
    const index = Math.floor(Math.random() * 5);
    const subindex = Math.floor(Math.random() * 5);
    data.push({
      province: province[index],
      district: district[index][subindex],
      subDistrict: district[index][subindex],
      zipCode: faker.address.zipCode(),
    });
  }

  await prisma.address.createMany({ data });
};

const createPatient = async () => {
  const data = [];

  for (let i = 1; i <= 154; i++) {
    data.push({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      phoneNumber: faker.phone.number(),
      emergencyPhoneNumber: faker.phone.number(),
      roomId: i,
      addressId: i,
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

  for (let i = 1; i <= 154; i++) {
    const index = Math.floor(Math.random() * 5);
    data.push({
      medicalHistory: faker.lorem.sentence(),
      doctor: doctors[index],
      patientId: i,
    });
  }

  await prisma.medicleHistory.createMany({ data });
};

const createInfusionHistory = async () => {
  const data = [
    {
      patientId: 1,
      dropRate: 40,
      nurse: 'Alex Jacobson',
    },
    {
      patientId: 2,
      dropRate: 100,
      nurse: 'Cecile Runolfsdottir',
    },
    {
      patientId: 3,
      dropRate: 80,
      nurse: 'Chelsea Thiel',
    },
    {
      patientId: 4,
      dropRate: 50,
      nurse: 'Larue Hirthe',
    },
    {
      patientId: 5,
      dropRate: 40,
      nurse: 'Issac Donnelly',
    },
    {
      patientId: 6,
      dropRate: 40,
      nurse: 'Larue Hirthe',
    },
  ];

  await prisma.infusionHistory.createMany({ data });
};
const main = async () => {
  await init();
  await createUser();
  await createFloor();
  await createRoom();
  await createAddress();
  await createPatient();
  await createMedicalHistory();
  await createInfusionHistory();
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
