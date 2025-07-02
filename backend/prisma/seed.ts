import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const user = await prisma.user.create({
    data: {
      username: 'kpopfan',
      email: 'fan@kpop.com',
      passwordHash: await bcrypt.hash('password123', 10),
    },
  });

  // Create artists
  const blackpink = await prisma.artist.create({
    data: {
      name: 'BLACKPINK',
      koreanName: '블랙핑크',
      debutDate: new Date('2016-08-08'),
      company: 'YG Entertainment',
      members: {
        create: [
          {
            name: 'Lalisa Manobal',
            koreanName: '리사',
            stageName: 'Lisa',
            birthDate: new Date('1997-03-27'),
            position: ['Main Dancer', 'Lead Rapper', 'Sub Vocalist', 'Maknae'],
          },
          {
            name: 'Kim Jisoo',
            koreanName: '지수',
            stageName: 'Jisoo',
            birthDate: new Date('1995-01-03'),
            position: ['Lead Vocalist', 'Visual'],
          },
          {
            name: 'Park Chaeyoung',
            koreanName: '로제',
            stageName: 'Rosé',
            birthDate: new Date('1997-02-11'),
            position: ['Main Vocalist', 'Lead Dancer'],
          },
          {
            name: 'Kim Jennie',
            koreanName: '제니',
            stageName: 'Jennie',
            birthDate: new Date('1996-01-16'),
            position: ['Main Rapper', 'Lead Vocalist'],
          },
        ],
      },
    },
  });

  // Create album
  const bornPink = await prisma.album.create({
    data: {
      artistId: blackpink.id,
      title: 'BORN PINK',
      koreanTitle: '본 핑크',
      releaseDate: new Date('2022-09-16'),
      type: 'FULL_ALBUM',
      tracks: {
        create: [
          {
            artistId: blackpink.id,
            title: 'Pink Venom',
            koreanTitle: '핑크 베놈',
            trackNumber: 1,
            isTitle: true,
            duration: 187,
          },
          {
            artistId: blackpink.id,
            title: 'Shut Down',
            trackNumber: 2,
            isTitle: true,
            duration: 175,
          },
          {
            artistId: blackpink.id,
            title: 'Typa Girl',
            trackNumber: 3,
            duration: 179,
          },
        ],
      },
    },
  });

  // Add more artists
  await prisma.artist.createMany({
    data: [
      {
        name: 'BTS',
        koreanName: '방탄소년단',
        debutDate: new Date('2013-06-13'),
        company: 'HYBE Labels',
      },
      {
        name: 'NewJeans',
        koreanName: '뉴진스',
        debutDate: new Date('2022-07-22'),
        company: 'ADOR',
      },
      {
        name: 'TWICE',
        koreanName: '트와이스',
        debutDate: new Date('2015-10-20'),
        company: 'JYP Entertainment',
      },
      {
        name: 'Stray Kids',
        koreanName: '스트레이 키즈',
        debutDate: new Date('2018-03-25'),
        company: 'JYP Entertainment',
      },
    ],
  });

  console.log('Database seeded! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });