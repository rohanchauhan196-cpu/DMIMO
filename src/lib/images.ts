/**
 * Central placeholder image configuration.
 * Swap any URL here (or in prisma/seed.ts for project/blog content) to replace
 * the architectural photography once real studio photography is available.
 */

function unsplash(id: string, w = 1800) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

export const imagePool = {
  heroMain: unsplash("1600585154340-be6161a56a0c", 2400),
  heroAlt: unsplash("1600596542815-ffad4c1539a9", 2400),

  aboutPortrait: unsplash("1600607687939-ce8a6c25118c"),
  aboutStudio: unsplash("1600210492486-724fe5c67fb0"),
  aboutPrinciple: unsplash("1512917774080-9991f1c4c750"),

  processBg: unsplash("1486406146926-c627a92ad1ab", 2400),
  ctaBg: unsplash("1460317442991-0ec209397118", 2400),
  contactVisual: unsplash("1507089947368-19c1da9775ae"),

  services: {
    architecture: unsplash("1449844908441-8829872d2607"),
    interiorDesign: unsplash("1600566753086-00f18fb6b3ea"),
    residential: unsplash("1600585152220-90363fe7e115"),
    commercial: unsplash("1431576901776-e539bd916ba2"),
    hospitality: unsplash("1545324418-cc1a3fa10c00"),
    urbanPlanning: unsplash("1522708323590-d24dbb6b0267"),
    renovation: unsplash("1448630360428-65456885c650"),
    consultancy: unsplash("1524758631624-e2822e304c36"),
  },

  projects: [
    unsplash("1600047509807-ba8f99d2cdde"),
    unsplash("1600566752355-35792bedcfea"),
    unsplash("1487958449943-2429e8be8625"),
    unsplash("1502672260266-1c1ef2d93688"),
    unsplash("1600573472550-8090b5e0745e"),
    unsplash("1600585154526-990dced4db0d"),
    unsplash("1600210491892-03d54c0aaf87"),
    unsplash("1600210492493-0946911123ea"),
    unsplash("1600566752229-250ed79470f8"),
    unsplash("1618221195710-dd6b41faaea6"),
    unsplash("1600047509358-9dc75507daeb"),
    unsplash("1554995207-c18c203602cb"),
    unsplash("1484154218962-a197022b5858"),
    unsplash("1493809842364-78817add7ffb"),
    unsplash("1600573472592-401b489a3cdc"),
    unsplash("1567767292278-a4f21aa2d36e"),
    unsplash("1582268611958-ebfd161ef9cf"),
    unsplash("1611892440504-42a792e24d32"),
    unsplash("1618220179428-22790b461013"),
    unsplash("1600489000022-c2086d79f9d4"),
    unsplash("1613977257363-707ba9348227"),
    unsplash("1592194996308-7b43878e84a6"),
    unsplash("1595526114035-0d45ed16cfbf"),
    unsplash("1600210491369-e753d80a41f3"),
    unsplash("1600607688969-a5bfcd646154"),
    unsplash("1600607688960-e095ff83135c"),
    unsplash("1613490493576-7fde63acd811"),
    unsplash("1486299267070-83823f5448dd"),
    unsplash("1506126613408-eca07ce68773"),
  ],
} as const;

export function projectImage(index: number) {
  return imagePool.projects[index % imagePool.projects.length];
}
