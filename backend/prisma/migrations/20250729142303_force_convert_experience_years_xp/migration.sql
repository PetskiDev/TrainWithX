-- Step 1: Add temporary column for experience as integer
ALTER TABLE "CreatorApplication" ADD COLUMN "experience_tmp" INTEGER;

-- Step 2: Convert string to integer with rounding
UPDATE "CreatorApplication"
SET "experience_tmp" = ROUND("experience"::NUMERIC);

-- Step 3: Drop old experience column
ALTER TABLE "CreatorApplication" DROP COLUMN "experience";

-- Step 4: Rename new column to experience
ALTER TABLE "CreatorApplication" RENAME COLUMN "experience_tmp" TO "experience";

-- Step 5: Make new column NOT NULL
ALTER TABLE "CreatorApplication" ALTER COLUMN "experience" SET NOT NULL;

-- Step 6: Convert yearsXP from Decimal(3,1) to Integer with rounding
ALTER TABLE "Creator"
ALTER COLUMN "yearsXP" TYPE INTEGER
USING ROUND("yearsXP");