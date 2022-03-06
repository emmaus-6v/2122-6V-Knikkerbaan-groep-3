# Verslag eindopdracht 6V
### gemaakt door *Valentijn van Winden*, *Gijs Arnold* en *Kevin Smit*
---

## Inleiding
De knikkerbaan. Een veelzijdig project, maar wel met veel uitdagingen. Grootse plannen, met vele tegenslagen. Maar toch is het gelukt.
We kwamen al vrij snel op het plan om een lift te gaan bouwen. Dit was een ambitieus plan, en heeft veel tijd gekost. De lift is daarmee onze 'unieke feature' die niemand anders heeft. Bovendien hebben wij animaties in de widget gemaakt, die synchroon lopen met het verloop van de fysieke knikkerbaan. In dit verslag leest u precies hoe de knikkerbaan werkt, en waar we allemaal tegenaan gelopen zijn.

## Features
Beschrijf hier de eigenschappen van jullie knikkerbaan (gebruik gerust plaatjes) kijk in map fotos naar KnikkerBaan.png . De eerste paar zijn voorgegeven:

### feature 1: Opvangen van knikkers
De knikkerbaan kan knikkers bovenin correct opvangen. De binnenkomende knikkers worden geteld en een poortje bepaalt of knikkers worden doorrollen of worden tegengehouden.

### feature 2: Doorgeven van gegevens aan server
De knikkerbaan zendt de hoeveelheid getelde knikkers naar een server die de gegevens opslaat in een database. Deze server kan per 'run' (d.w.z. een nieuwe keer aangaan) gegevens bijhouden.

### feature 3: Widget wisselt info uit met knikkerbaan
In de browser kan met een URL een widget worden geladen. Deze geeft de knikkerbaan schematisch weer in een frame van 800x400px. De getelde knikkers en duur dat de poort openstaat worden hierin getoond. De duur dat de poort openstaat kan hierin worden veranderd. De knikkerbaan kan deze wachttijd van de server ontvangen en zijn werking erop aanpassen.

## Scrum planning:

### Week 44
- Schets ontwerp knikkerbaan maken
- Onderdelen knikkerbaan uitzoeken

### Week 45
- Toetsweek

### Week 46
- Toetsweek
- TU Delft open dag

### Week 47
- Concept ontwerp maken
- Definitief ontwerp maken

### Week 48
- Begin maken hardware gedeelte knikkerbaan

### Week 49 & 50
- Hardware gedeelte afronden

### Week 51
- In de les begin maken aan code (waarschijnlijk druk met toetsen, dus niks thuis)

### Kerstvakantie
- Evt. verderwerken aan code, keer afspreken

## Evaluatie planning
Het bouwen van de knikkerbaan duurde langer dan verwacht. Vooral omdat we een aantal problemen ondervonden met de lift, zoals een touwtje wat afbrak waardoor we de lift gedeeltelijk opnieuw hebben moeten maken. Het bouwen van de rest van de baan verliep redelijk soepel, verreweg de grootste uitdaging van onze knikkerbaan was het werkend krijgen van de lift.

Achteraf gezien hebben we iets te veel tijd besteed aan het bouwen van de knikkerbaan (en vooral de lift), en hebben we daardoor nog maar weinig weken over gehad om de code te schrijven en testen. Gelukkig is dit uiteindelijk nog wel gelukt, en hebben we een mooie widget weten te maken met veel features, zoals animaties en de mogelijkheid van instellingen aanpassen. Hier hebben we (doordat het bouwen van de baan zo lang duurde) wel in de voorjaarsvakantie veel aan moeten doen.


## Technische verantwoording
### De Arduino werkt op de volgende manier:
De Arduino werkt met 5 verschillende fases. De knikkerbaan begint altijd in de eerste fase (fase 0).
- Fase 0: Het poortje van de knikkerbaan staat open, voor een x aantal seconden. Het exacte aantal seconden kan ik de widget ingesteld worden. De knikkers gaan de lift in, terwijl ze geteld worden.
- Fase 1: Het poortje van de knikkerbaan gaat dicht. De laatste knikkers stromen binnen, en ook deze worden nog geteld. Er komen dus geen nieuwe knikkers meer in de knikkerbaan, die blijven bovenaan wachten tot de volgende run. De knikkers stromen naar de lift, de tijd tussen deze fase en het omhoog gaan van de lift kan ook bepaald worden in de widget.
- Fase 2: De lift is omhoog aan het gaan. De servo blijft draaien totdat de afstandssensor aangeeft dat de lift boven is. Dit wordt ook in de widget met een animatie laten zien. De snelheid van de lift kan worden aangepast in de widget, in een percentage. Als de lift boven is begint fase 3.
- Fase 3: De lift is boven, en de knikkers stromen uit de lift. De RGB-strip in de 'lichttunnel' gaat aan. De duur van deze fase kan bepaald worden in de widget.
- Fase 4: De lift is naar beneden aan het gaan. De servo blijft draaien totdat de afstandssensor aangeeft dat de lift beneden is. Zodra de lift beneden is begint fase 5.
- Fase 5: Als de lift weer beneden is, kan de nieuwe fase zo beginnen. Eerste worden er een aantal requests gemaakt. Het aantal knikkers van deze run wordt doorgegeven, het totale aantal knikkers wordt doorgegeven en er wordt een request gestuurd die aangeeft dat er een nieuwe run start. Bovendien worden in deze fase de nieuwe instellingen van de widget opgehaald (de 4 sliders), die in de volgende run worden toegepast. Als alle requests gemaakt zijn begint fase 0 weer.

### De knikkerbaan en de widget wisselen de volgende data met elkaar uit:
- De instellingen (widget -> knikkerbaan)
- De sensor data (knikkerbaan -> widget)

### We hebben dat op deze manier genormaliseerd in een database opgenomen:
De datastructuur die in de standaardcode stond voldeed al redelijk goed aan onze eisen. Het enige wat we hebben veranderd, is de manier waarop de instellingen en sensor data worden opgeslagen. In de standaardcode werd dit gedaan in een kolom, maar wij vonden het makkelijker om die met een 'key value' systeem te doen. Dat houdt in dat de 'key' kolom de naam van de instelling / sensor bevat, en de 'value' kolom de waarde hiervan. Op deze manier kun je makkelijker nieuwe instellingen toevoegen. Dit hebben we ook moeten aanpassen in de server app.

### Uitdagingen die we tegenkwamen:
- De grootste uitdaging die we tegenkwamen was het bouwen van de lift... Het ontwerpen / bouwen van het mechanische gedeelte hiervan kostte veel meer tijd dan wij hadden gehoopt.
- Het aansturen van de lift was ook lastig. In eerste instantie hadden we twee 360 servo motors gemonteerd, die elkaar ondersteunden door het touwtje te 'duwen' en te trekken. Dit bleek echter moeilijk te programmeren, dus hebben we de onderste servo weggehaald en een gewichtje gebruikt om de lift naar beneden te krijgen. Dan kwamen we ook nog het probleem tegen om te bepalen wanneer de lift boven / beneden was aangekomen. In eerste instantie hebben we de 360 servo vervangen door een stepper motor, maar ook dit bleek niet handig aangezien de afstand die de stepper motor aflegde ook nog kon varieren en de motor bovendien heel langzaam ging. We hebben de 360 servo weer teruggemonteerd en bovendien een ultrasone afstandssensor gebruikt. Deze bepaalt of de lift beneden of boven is, en bleek nauwkeurig genoeg te zijn.
- We ondervonden ook een probleem met de opvangbak, de knikkers vielen er in eerste instantie soms uit tijdens de vrije val. Dit heeft Kevin opgelost door van blik een wand te maken en een aantal kleine plankjes te monteren waardoor de knikker altijd goed terecht komt.
- Een andere uitdaging was het aan de praat krijgen van de Arduino. Deze wilde in het begin maar niet verbinden met de wifi. Het probleem bleek de firmware te zijn. Valentijn heeft thuis uitgezocht hoe we de firmware konden updaten, en dit ook gedaan. Daarna werkte het verbinden, maar wilde de Arduino nog geen requests maken. Na lang zoeken en debuggen bleek het aan de USB-verlengkabel te liggen die we gebruikten... Na het uploaden van de code zonder deze verlengkabel werkte alles, en bleek al het debuggen verspilde tijd. Welkom in de programmeerwereld.

## Reflectie op opdracht
#### Valentijn
*Het programmeergedeelte was voor mij niet lastig. Ik heb al een paar honderd (misschien zelfs wel duizend) ervaring met JavaScript en SQL, dus dit gedeelte was appeltje eitje. Het enige wat wat moeizaam ging, is overschakelen naar C++ voor het programmeren van de Arduino. Af en toe liep ik tegen problemen met verschillende datatypes aan, zoals een vermenigvuldiging tussen een int en een float die altijd 0 gaf, wat bleek te liggen aan de verschillende datatypes. Ook bleek het soms helemaal niet aan de code te liggen, maar aan de hardware. Al met al vond ik het wel een leuke opdracht, vooral omdat het goed aansluit op de studie die ik ga doen: mechanical engineering*

#### Gijs
*Het project is al met al redelijk soepeltjes verlopen. We hebben zowaar iets van een planning gemaakt en ons daar ook aan gehouden, wat al een wonder op zich is. Ik heb me vooral bezig gehouden met hardware, aangezien coderen niet echt mijn ding is. De taakverdeling was dus ook goed geregeld: iedereen deed dat waar die goed in is. Verder was de samenwerking ook in orde; we hebben ons aan onze onderlinge afspraken gehouden en gezamenlijke tussenuurtjes gebruikt om samen aan de lift te werken. Vond het een leuke opdracht, vanwege de combinatie hardware/software.*




## Slot
