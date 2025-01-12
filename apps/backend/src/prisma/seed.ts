import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

const mockData = {
  cities: [{ name: 'Warsaw' }, { name: 'Kraków' }, { name: 'Wrocław' }],
  universities: [
    { name: 'University of Warsaw' },
    { name: 'Jagiellonian University' },
    { name: 'Wrocław University of Science and Technology' },
  ],
  users: [
    {
      first_name: 'Anna',
      last_name: 'Kowalski',
      email: 'anna.kowalski@example.com',
      password: 'hashedPassword123',
      gender: 'Female',
      status: true,
      role: 'USER',
      city: 'Warsaw',
      university: 'University of Warsaw',
    },
    {
      first_name: 'Piotr',
      last_name: 'Nowak',
      email: 'piotr.nowak@admin.com',
      password: 'hashedPassword456',
      gender: 'Male',
      status: true,
      role: 'ADMIN',
      city: 'Kraków',
      university: 'Jagiellonian University',
    },
  ],
};

async function main() {
  // Clean up existing data
  await prisma.usersOnEvents.deleteMany({});
  await prisma.bookmark.deleteMany();
  await prisma.user.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.university.deleteMany({});
  await prisma.event.deleteMany();

  const cityMap: { [key: string]: string } = {};
  const universityMap: { [key: string]: string } = {};

  // Insert cities and store their IDs in a map
  for (const city of mockData.cities) {
    const createdCity = await prisma.city.create({ data: city });
    cityMap[createdCity.name] = createdCity.id; // Store city ID by name
  }

  // Insert universities and store their IDs in a map
  for (const university of mockData.universities) {
    const createdUniversity = await prisma.university.create({
      data: university,
    });
    universityMap[createdUniversity.name] = createdUniversity.id; // Store university ID by name
  }

  // Insert users with city and university relations
  for (const user of mockData.users) {
    const cityId = cityMap[user.city];
    const universityId = universityMap[user.university];

    const hashedPassword = await argon.hash(user.password);

    if (cityId && universityId) {
      await prisma.user.create({
        data: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          password: hashedPassword, // Ensure this is hashed in a real application
          gender: user.gender,
          status: user.status,
          role: user.role,
          city: { connect: { id: cityId } },
          university: { connect: { id: universityId } },
        },
      });
    } else {
      console.error(
        `City or University not found for user: ${user.first_name} ${user.last_name}`,
      );
    }
  }

  console.log('Mock data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
