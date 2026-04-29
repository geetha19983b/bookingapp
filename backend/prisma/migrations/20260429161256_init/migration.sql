-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(255),
    "display_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "work_phone" VARCHAR(20),
    "mobile_phone" VARCHAR(20),
    "billing_address_line1" VARCHAR(255),
    "billing_address_line2" VARCHAR(255),
    "billing_city" VARCHAR(100),
    "billing_state" VARCHAR(100),
    "billing_country" VARCHAR(100),
    "billing_zip_code" VARCHAR(20),
    "shipping_address_line1" VARCHAR(255),
    "shipping_address_line2" VARCHAR(255),
    "shipping_city" VARCHAR(100),
    "shipping_state" VARCHAR(100),
    "shipping_country" VARCHAR(100),
    "shipping_zip_code" VARCHAR(20),
    "gst_treatment" VARCHAR(100),
    "gstin" VARCHAR(15),
    "source_of_supply" VARCHAR(100),
    "pan" VARCHAR(10),
    "is_msme_registered" BOOLEAN NOT NULL DEFAULT false,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "opening_balance" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "payment_terms" VARCHAR(100) NOT NULL DEFAULT 'Due on Receipt',
    "bank_name" VARCHAR(255),
    "bank_account_number" VARCHAR(50),
    "bank_ifsc_code" VARCHAR(11),
    "bank_branch" VARCHAR(255),
    "remarks" TEXT,
    "custom_fields" JSONB,
    "reporting_tags" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "item_type" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(100),
    "unit" VARCHAR(50),
    "hsn_code" VARCHAR(20),
    "tax_preference" VARCHAR(50) NOT NULL DEFAULT 'taxable',
    "intra_state_tax_rate" VARCHAR(50),
    "intra_state_tax_percentage" DECIMAL(5,2),
    "inter_state_tax_rate" VARCHAR(50),
    "inter_state_tax_percentage" DECIMAL(5,2),
    "is_sellable" BOOLEAN NOT NULL DEFAULT true,
    "selling_price" DECIMAL(15,2),
    "sales_account" VARCHAR(100),
    "sales_description" TEXT,
    "is_purchasable" BOOLEAN NOT NULL DEFAULT true,
    "cost_price" DECIMAL(15,2),
    "purchase_account" VARCHAR(100),
    "purchase_description" TEXT,
    "preferred_vendor_id" INTEGER,
    "track_inventory" BOOLEAN NOT NULL DEFAULT false,
    "opening_stock" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "opening_stock_rate" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "reorder_level" DECIMAL(15,2),
    "image_url" VARCHAR(500),
    "image_urls" TEXT[],
    "custom_fields" JSONB,
    "tags" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_persons" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
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

    CONSTRAINT "contact_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_items_history" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "purchase_price" DECIMAL(15,2) NOT NULL,
    "quantity" DECIMAL(15,2),
    "unit" VARCHAR(50),
    "purchase_order_number" VARCHAR(100),
    "invoice_number" VARCHAR(100),
    "purchase_date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_items_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendors_display_name_key" ON "vendors"("display_name");

-- CreateIndex
CREATE INDEX "vendors_display_name_idx" ON "vendors"("display_name");

-- CreateIndex
CREATE INDEX "vendors_email_idx" ON "vendors"("email");

-- CreateIndex
CREATE INDEX "vendors_is_active_idx" ON "vendors"("is_active");

-- CreateIndex
CREATE INDEX "vendors_created_at_idx" ON "vendors"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "items_sku_key" ON "items"("sku");

-- CreateIndex
CREATE INDEX "items_name_idx" ON "items"("name");

-- CreateIndex
CREATE INDEX "items_sku_idx" ON "items"("sku");

-- CreateIndex
CREATE INDEX "items_item_type_idx" ON "items"("item_type");

-- CreateIndex
CREATE INDEX "items_hsn_code_idx" ON "items"("hsn_code");

-- CreateIndex
CREATE INDEX "items_preferred_vendor_id_idx" ON "items"("preferred_vendor_id");

-- CreateIndex
CREATE INDEX "items_is_active_idx" ON "items"("is_active");

-- CreateIndex
CREATE INDEX "items_is_sellable_idx" ON "items"("is_sellable");

-- CreateIndex
CREATE INDEX "items_is_purchasable_idx" ON "items"("is_purchasable");

-- CreateIndex
CREATE INDEX "items_created_at_idx" ON "items"("created_at");

-- CreateIndex
CREATE INDEX "contact_persons_vendor_id_idx" ON "contact_persons"("vendor_id");

-- CreateIndex
CREATE INDEX "contact_persons_email_idx" ON "contact_persons"("email");

-- CreateIndex
CREATE INDEX "contact_persons_is_primary_idx" ON "contact_persons"("is_primary");

-- CreateIndex
CREATE INDEX "vendor_items_history_vendor_id_idx" ON "vendor_items_history"("vendor_id");

-- CreateIndex
CREATE INDEX "vendor_items_history_item_id_idx" ON "vendor_items_history"("item_id");

-- CreateIndex
CREATE INDEX "vendor_items_history_purchase_date_idx" ON "vendor_items_history"("purchase_date");

-- CreateIndex
CREATE INDEX "vendor_items_history_vendor_id_item_id_purchase_date_idx" ON "vendor_items_history"("vendor_id", "item_id", "purchase_date");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_preferred_vendor_id_fkey" FOREIGN KEY ("preferred_vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_persons" ADD CONSTRAINT "contact_persons_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_items_history" ADD CONSTRAINT "vendor_items_history_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_items_history" ADD CONSTRAINT "vendor_items_history_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
