# Email Functionaliteit Testen

## Stap 1: Check Environment Variables

Zorg dat deze variabelen zijn ingesteld in Railway of je lokale `.env` bestand:

```env
SMTP_HOST=smtp.jouw-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=jouw-email@example.com
SMTP_PASSWORD=jouw-smtp-wachtwoord
CONTACT_EMAIL=waar-emails-naartoe@example.com
```

## Stap 2: Lokaal Testen

1. Start de CMS lokaal:
```bash
cd cms
npm install
npm start
```

2. Open `test-form/index.html` in je browser

3. Vul het formulier in en verstuur

4. Check de terminal waar de CMS draait voor logs:
   - `📧 Contact form submission received` - Request ontvangen
   - `✅ Validation passed` - Validatie geslaagd
   - `✅ Email sent successfully` - Email verzonden
   - `❌ Contact form error` - Er is een fout opgetreden

## Stap 3: Railway Logs Checken

1. Ga naar Railway Dashboard
2. Klik op je VBS-De-Freres service
3. Ga naar "Deployments" tab
4. Klik op de actieve deployment
5. Scroll naar de logs sectie

## Veelvoorkomende Problemen

### "SMTP connection error"
- Check of je SMTP credentials correct zijn
- Controleer of SMTP_PORT correct is (meestal 587 of 465)
- Voor Gmail: gebruik een App Password, niet je normale wachtwoord

### "Authentication failed"
- SMTP_USER en SMTP_PASSWORD zijn incorrect
- Voor Gmail: schakel "Less secure app access" in OF gebruik App Password

### "Connection timeout"
- Firewall blokkeert SMTP poort
- SMTP_HOST is incorrect

### "Certificate error"
- Oude Node.js versie
- TLS versie niet ondersteund door server

## Gmail Setup (Voorbeeld)

Als je Gmail gebruikt:

1. Ga naar https://myaccount.google.com/security
2. Schakel 2-Step Verification in
3. Ga naar "App passwords"
4. Genereer een app password voor "Mail"
5. Gebruik deze credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=jouw-gmail@gmail.com
SMTP_PASSWORD=jouw-app-password-hier
CONTACT_EMAIL=waar-je-emails-wilt-ontvangen@gmail.com
```

## Test Checklist

- [ ] Environment variables ingesteld
- [ ] CMS draait zonder errors
- [ ] SMTP connectie succesvol (zie logs bij start)
- [ ] Test formulier verstuurd
- [ ] Logs tonen "Email sent successfully"
- [ ] Email ontvangen in inbox (check ook spam folder!)
