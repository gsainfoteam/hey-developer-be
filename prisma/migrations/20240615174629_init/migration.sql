-- CreateTable
CREATE TABLE "Photo" (
    "uuid" UUID NOT NULL,
    "photo" TEXT NOT NULL,
    "feedback_uuid" UUID NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "uuid" UUID NOT NULL,
    "service" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_feedback_uuid_fkey" FOREIGN KEY ("feedback_uuid") REFERENCES "Feedback"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
