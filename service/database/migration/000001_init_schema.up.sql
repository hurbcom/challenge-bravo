CREATE TABLE "currencies" (
    "id" bigserial PRIMARY KEY,
    "short_name" varchar(10) NOT NULL,
    "rate_usd" decimal NOT NULL,
    "reference_date" date NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX "idx_shortname" ON "currencies" ("short_name");
