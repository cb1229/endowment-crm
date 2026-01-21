import { db } from './index';
import { firms, funds, companies, notes, noteEntityTags, deals } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create Firms
    console.log('Creating firms...');
    const [sequoia] = await db.insert(firms).values({
      name: 'Sequoia Capital',
      marketType: 'private_markets',
      description: 'Leading venture capital firm focused on early-stage startups',
      website: 'https://www.sequoiacap.com',
      headquarters: 'Menlo Park, CA',
      foundedYear: 1972,
    }).returning();

    const [blackrock] = await db.insert(firms).values({
      name: 'BlackRock',
      marketType: 'public_markets',
      description: 'World\'s largest asset manager specializing in public markets',
      website: 'https://www.blackrock.com',
      headquarters: 'New York, NY',
      foundedYear: 1988,
    }).returning();

    const [a16z] = await db.insert(firms).values({
      name: 'Andreessen Horowitz',
      marketType: 'private_markets',
      description: 'Venture capital firm investing in technology companies',
      website: 'https://a16z.com',
      headquarters: 'Menlo Park, CA',
      foundedYear: 2009,
    }).returning();

    // Create Funds
    console.log('Creating funds...');
    const [sequoiaFund] = await db.insert(funds).values({
      name: 'Sequoia Capital Fund XVI',
      firmId: sequoia.id,
      marketType: 'private_markets',
      description: 'Latest flagship venture fund',
      vintageYear: 2023,
      fundSize: '$2.8B',
      strategy: 'Early-stage venture capital',
    }).returning();

    const [blackrockFund] = await db.insert(funds).values({
      name: 'BlackRock Global Allocation Fund',
      firmId: blackrock.id,
      marketType: 'public_markets',
      description: 'Multi-asset allocation strategy',
      vintageYear: 2022,
      fundSize: '$85B',
      strategy: 'Global diversified portfolio',
    }).returning();

    const [a16zFund] = await db.insert(funds).values({
      name: 'a16z Crypto Fund III',
      firmId: a16z.id,
      marketType: 'private_markets',
      description: 'Focused on crypto and web3 investments',
      vintageYear: 2022,
      fundSize: '$4.5B',
      strategy: 'Crypto and blockchain technology',
    }).returning();

    // Create Companies
    console.log('Creating companies...');
    const [stripe] = await db.insert(companies).values({
      name: 'Stripe',
      description: 'Payment processing platform for internet businesses',
      website: 'https://stripe.com',
      industry: 'FinTech',
      headquarters: 'San Francisco, CA',
      foundedYear: 2010,
    }).returning();

    const [openai] = await db.insert(companies).values({
      name: 'OpenAI',
      description: 'AI research and deployment company',
      website: 'https://openai.com',
      industry: 'Artificial Intelligence',
      headquarters: 'San Francisco, CA',
      foundedYear: 2015,
    }).returning();

    const [coinbase] = await db.insert(companies).values({
      name: 'Coinbase',
      description: 'Cryptocurrency exchange platform',
      website: 'https://coinbase.com',
      industry: 'Cryptocurrency',
      headquarters: 'San Francisco, CA',
      foundedYear: 2012,
    }).returning();

    // Create Notes
    console.log('Creating notes...');
    const [note1] = await db.insert(notes).values({
      title: 'Q4 Portfolio Review with Sequoia',
      content: 'Met with the Sequoia team to review Q4 performance. Fund XVI is performing above expectations with strong returns from the AI/ML portfolio companies. Discussed potential co-investment opportunities in the next funding round for Stripe. Key takeaway: increasing allocation to infrastructure plays.',
      userId: 'e17b451a-4302-49c7-9c3a-98874360223e',
      authorId: 'e17b451a-4302-49c7-9c3a-98874360223e',
      originalAuthorName: 'Sarah Chen',
      isPublic: true,
    }).returning();

    const [note2] = await db.insert(notes).values({
      title: 'OpenAI Investment Thesis',
      content: 'Detailed analysis of OpenAI\'s market position and growth trajectory. With GPT-4 adoption accelerating across enterprise, revenue projections look strong. Concerned about regulatory headwinds in EU. Recommendation: Increase position if valuation dips below $80B.',
      userId: 'e17b451a-4302-49c7-9c3a-98874360223e',
      authorId: 'e17b451a-4302-49c7-9c3a-98874360223e',
      originalAuthorName: 'Michael Rodriguez',
      isPublic: true,
    }).returning();

    const [note3] = await db.insert(notes).values({
      title: 'BlackRock Public Markets Update',
      content: 'Quarterly call with BlackRock Global Allocation team. Shifting toward defensive positioning amid interest rate uncertainty. Reducing tech exposure by 5% and increasing utilities and consumer staples. Fund returned 8.2% YTD vs benchmark 6.5%.',
      userId: 'e17b451a-4302-49c7-9c3a-98874360223e',
      authorId: 'e17b451a-4302-49c7-9c3a-98874360223e',
      originalAuthorName: 'Sarah Chen',
      isPublic: true,
    }).returning();

    const [note4] = await db.insert(notes).values({
      title: 'a16z Crypto Strategy Discussion',
      content: 'Deep dive on a16z\'s crypto thesis for 2024. Focus shifting from DeFi to real-world asset tokenization and enterprise blockchain. Coinbase remains a core holding. Discussed potential LP commitment to Fund IV launching Q2.',
      userId: 'e17b451a-4302-49c7-9c3a-98874360223e',
      authorId: 'e17b451a-4302-49c7-9c3a-98874360223e',
      originalAuthorName: 'James Wilson',
      isPublic: true,
    }).returning();

    // Create Note Entity Tags (many-to-many relationships)
    console.log('Creating note entity tags...');

    // Note 1: Tagged to Sequoia (firm), Sequoia Fund XVI (fund), and Stripe (company)
    await db.insert(noteEntityTags).values([
      { noteId: note1.id, entityType: 'firm', entityId: sequoia.id },
      { noteId: note1.id, entityType: 'fund', entityId: sequoiaFund.id },
      { noteId: note1.id, entityType: 'company', entityId: stripe.id },
    ]);

    // Note 2: Tagged to OpenAI (company) and Sequoia (firm)
    await db.insert(noteEntityTags).values([
      { noteId: note2.id, entityType: 'company', entityId: openai.id },
      { noteId: note2.id, entityType: 'firm', entityId: sequoia.id },
    ]);

    // Note 3: Tagged to BlackRock (firm) and BlackRock Fund (fund)
    await db.insert(noteEntityTags).values([
      { noteId: note3.id, entityType: 'firm', entityId: blackrock.id },
      { noteId: note3.id, entityType: 'fund', entityId: blackrockFund.id },
    ]);

    // Note 4: Tagged to a16z (firm), a16z Fund (fund), and Coinbase (company)
    await db.insert(noteEntityTags).values([
      { noteId: note4.id, entityType: 'firm', entityId: a16z.id },
      { noteId: note4.id, entityType: 'fund', entityId: a16zFund.id },
      { noteId: note4.id, entityType: 'company', entityId: coinbase.id },
    ]);

    // Create Deals
    console.log('Creating deals...');
    await db.insert(deals).values([
      {
        name: 'OpenAI Series C Follow-On',
        entityType: 'company',
        entityId: openai.id,
        stage: 'diligence',
        priority: 'high',
        description: 'Follow-on investment in OpenAI at $80B valuation',
        proposedAmount: '$25M',
        expectedCloseDate: new Date('2024-06-30'),
        ownerId: 'user_002',
        ownerName: 'Michael Rodriguez',
      },
      {
        name: 'a16z Fund IV Commitment',
        entityType: 'fund',
        entityId: a16zFund.id,
        stage: 'ic_vote',
        priority: 'medium',
        description: 'New LP commitment to a16z Crypto Fund IV',
        proposedAmount: '$50M',
        expectedCloseDate: new Date('2024-09-30'),
        ownerId: 'user_003',
        ownerName: 'James Wilson',
      },
      {
        name: 'Stripe Secondary Purchase',
        entityType: 'company',
        entityId: stripe.id,
        stage: 'triage',
        priority: 'medium',
        description: 'Potential secondary purchase from early employee',
        proposedAmount: '$10M',
        expectedCloseDate: new Date('2024-08-15'),
        ownerId: 'user_001',
        ownerName: 'Sarah Chen',
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\nSeeded:');
    console.log('- 3 Firms (Sequoia, BlackRock, a16z)');
    console.log('- 3 Funds');
    console.log('- 3 Companies (Stripe, OpenAI, Coinbase)');
    console.log('- 4 Notes with entity tags');
    console.log('- 3 Deals');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('\n🎉 Seed completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
