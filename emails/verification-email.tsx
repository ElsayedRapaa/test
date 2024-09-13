import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  opt: string;
}

export default function VerificationEmail({
  username,
  opt,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/LFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {opt}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use the following verification cod
            to complete your registration;
          </Text>
        </Row>
        <Row>
          <Text>
            if you did not request this code, please ignore this email.
          </Text>
        </Row>
        {/* <Row>
          <Button
            href='/'
            style={{color: '#61dafb'}}
          >
            Verify here
          </Button>
        </Row> */}
      </Section>
    </Html>
  );
}