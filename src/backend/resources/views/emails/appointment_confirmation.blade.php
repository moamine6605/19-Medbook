<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Confirmation de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
<h2>Bonjour {{ $patient->name ?? 'Patient' }},</h2>

<p>Votre rendez-vous a bien ete confirme.</p>

<ul>
    <li><strong>Medecin:</strong> Dr. {{ $doctor->name ?? '-' }} ({{ $doctor->specialty ?? '-' }})</li>
    <li><strong>Date:</strong> {{ optional($appointment->date)->format('Y-m-d') }}</li>
    <li><strong>Heure:</strong> {{ $appointment->time }}</li>
    <li><strong>Type:</strong> {{ $appointment->type === 'video' ? 'Video' : 'En personne' }}</li>
</ul>

<p>Merci d'utiliser Medbook.</p>
</body>
</html>

