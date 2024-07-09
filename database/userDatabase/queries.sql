ALTER TABLE "public"."userDatabase" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow Signed Up User To Insert Profile In userDatabase"
ON "public"."userDatabase"
FOR INSERT
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Allow User To Edit Their Own Data" 
ON "public"."userDatabase" 
AS permissive 
FOR all 
TO public 
USING ((auth.uid() = "userId"));


CREATE POLICY "Allow Signed Up User to Read Their Data In userDatabase" 
ON "public"."userDatabase" 
AS permissive 
FOR select 
TO public 
USING ((auth.uid() = "userId"));