-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "customer_type" VARCHAR(20) NOT NULL DEFAULT 'business',
    "salutation" VARCHAR(10),
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "company_name" VARCHAR(255),
    "display_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "work_phone" VARCHAR(20),
    "mobile_phone" VARCHAR(20),
    "customer_language" VARCHAR(50) DEFAULT 'English',
    "billing_attention" VARCHAR(255),
    "billing_address_line1" VARCHAR(255),
    "billing_address_line2" VARCHAR(255),
    "billing_city" VARCHAR(100),
    "billing_state" VARCHAR(10),
    "billing_country" VARCHAR(2),
    "billing_zip_code" VARCHAR(20),
    "billing_phone" VARCHAR(20),
    "billing_fax" VARCHAR(20),
    "shipping_attention" VARCHAR(255),
    "shipping_address_line1" VARCHAR(255),
    "shipping_address_line2" VARCHAR(255),
    "shipping_city" VARCHAR(100),
    "shipping_state" VARCHAR(10),
    "shipping_country" VARCHAR(2),
    "shipping_zip_code" VARCHAR(20),
    "shipping_phone" VARCHAR(20),
    "shipping_fax" VARCHAR(20),
    "gst_treatment" VARCHAR(100),
    "gstin" VARCHAR(15),
    "place_of_supply" VARCHAR(100),
    "pan" VARCHAR(10),
    "tax_preference" VARCHAR(20) NOT NULL DEFAULT 'taxable',
    "currency" VARCHAR(3) DEFAULT 'INR',
    "opening_balance" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "payment_terms" VARCHAR(100) DEFAULT 'Due on Receipt',
    "enable_portal" BOOLEAN NOT NULL DEFAULT false,
    "document_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "remarks" TEXT,
    "custom_fields" JSONB,
    "reporting_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_contact_persons" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "salutation" VARCHAR(10),
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "email" VARCHAR(255),
    "work_phone" VARCHAR(20),
    "mobile_phone" VARCHAR(20),
    "designation" VARCHAR(100),
    "department" VARCHAR(100),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_contact_persons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_display_name_key" ON "customers"("display_name");

-- CreateIndex
CREATE INDEX "customers_display_name_idx" ON "customers"("display_name");

-- CreateIndex
CREATE INDEX "customers_email_idx" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_customer_type_idx" ON "customers"("customer_type");

-- CreateIndex
CREATE INDEX "customers_is_active_idx" ON "customers"("is_active");

-- CreateIndex
CREATE INDEX "customers_created_at_idx" ON "customers"("created_at");

-- CreateIndex
CREATE INDEX "customer_contact_persons_customer_id_idx" ON "customer_contact_persons"("customer_id");

-- CreateIndex
CREATE INDEX "customer_contact_persons_email_idx" ON "customer_contact_persons"("email");

-- CreateIndex
CREATE INDEX "customer_contact_persons_is_primary_idx" ON "customer_contact_persons"("is_primary");

-- AddForeignKey
ALTER TABLE "customer_contact_persons" ADD CONSTRAINT "customer_contact_persons_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
