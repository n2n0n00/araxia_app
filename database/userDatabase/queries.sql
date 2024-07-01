ALTER TABLE "public"."userDatabase" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow Signed Up User To Insert Profile In userDatabase"
ON "public"."userDatabase"
FOR INSERT
WITH CHECK (auth.uid() = "userId");