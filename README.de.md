*[English](README.md) · Deutsch*

# Übungen: Design Patterns als Funktionen

Übungs-Repo zum Workshop „Design Patterns als Funktionen“. Zu jeder der neun Übungen gibt es eine README mit der Aufgabe, einen Startpunkt mit Tests in `src/` und eine mögliche Lösung in `solution/`. Jedes Pattern beginnt mit einem Problem im Werkstatt-Shop – Bestellungen, Lagerbestand, Preise, Zahlung und Versand – und wird als einfache TypeScript-Funktion geschrieben: keine Klassen, kein Dependency-Injection-Container. Danach findest du es in Express, React und Apollo Server wieder.

## Was du lernst

- Das Problem vor dem Pattern benennen und erkennen, wann eine einfache Funktion reicht
- Facade, Proxy, Chain of Responsibility, Decorator, Strategy, Command und Factory als Funktionen und Closures schreiben
- Provider, Context, Observer und State Machine in React, GraphQL und Node.js wiedererkennen – und wieder abbauen, wo sie nichts bringen

## Voraussetzungen

- **Node.js 26** oder neuer – `engines` in [`package.json`](package.json) nennt `>=26`.
- **npm 12** – `devEngines` in `package.json` verlangt `^12.2.0` und bricht mit jeder anderen Version ab. Zeigt `npm --version` etwas Älteres, aktualisiere zuerst: `npm install -g npm@12`.

## Einrichten

```bash
git clone https://github.com/MikeBild/introduction-design-patterns.git
cd introduction-design-patterns
npm install -g npm@12   # nur, wenn npm --version noch keine 12 zeigt
npm ci                  # installiert alle drei Pakete des Workspace
npm test                # Vitest für Startpunkte und Lösungen
npm run typecheck       # TypeScript strict
```

npm blockiert beim Installieren die Install-Scripts von `fsevents` und `@apollo/protobufjs` und meldet das als Warnung. Nichts hier braucht sie. Das Repo ist ein npm-Workspace mit `install-strategy=linked` ([`.npmrc`](.npmrc)): Ein Paket sieht nur die Abhängigkeiten, die es selbst deklariert.

## So arbeitest du mit einer Übung

```text
packages/
  connect-chain/
    package.json           Abhängigkeiten dieses Pakets, hier Express 5
    src/
      facade-proxy/
        README.md          Aufgabe, Schritte, Lösung
        callers.ts         dein Startpunkt
        services.ts        Typen und In-Memory-Services des Werkstatt-Shops
        callers.test.ts    Tests zum Stand des Startpunkts, dazu it.todo für deine Tests
    solution/
      facade-proxy/        eine mögliche Lösung samt Tests
```

1. Lies die `README.md` der Übung und öffne den Startpunkt in `src/`.
2. Führe die Tests aus und lies sie. Die Tests halten die Bugs des Startpunkts fest und sind grün aus dem falschen Grund; die `it.todo`-Einträge sind dein Teil.
3. Arbeite die Schritte der Aufgabe ab und ersetze die Bug-Tests und die `it.todo`-Einträge durch Tests für das richtige Verhalten.
4. Vergleiche danach mit `solution/`.

Vom Hauptverzeichnis aus:

| Befehl | Was es tut |
| --- | --- |
| `npm test` | Vitest für alle Startpunkte und Lösungen |
| `npm run test:watch` | Vitest im Watch Mode |
| `npx vitest run packages/share-react` | nur ein Paket |
| `npx vitest run packages/connect-chain/src/chain` | nur der Startpunkt einer Übung |
| `npx vitest run packages/connect-chain/solution/chain` | nur die Lösung einer Übung |
| `npm run typecheck` | TypeScript strict für Startpunkte und Lösungen |
| `npm run format` | Prettier für das ganze Repo |

## Übungen

Drei Pakete, neun Übungen, von einfach nach schwer. Die Nummer gibt die Reihenfolge vor; jede Übung ist ein Ordner unter `src/` mit eigener README.

### Verbinden und verketten – `packages/connect-chain`

Die Chain-Übung baut auf Express 5 auf.

| Nr. | Pattern | Lektion | Übung |
| --- | --- | --- | --- |
| 01 | – | Erst das Problem, dann das Pattern | [src/why](packages/connect-chain/src/why/README.md) |
| 02 | Facade, Proxy | Eine Facade vereinfacht, ein Proxy kontrolliert | [src/facade-proxy](packages/connect-chain/src/facade-proxy/README.md) |
| 03 | Chain of Responsibility | Jeder Schritt entscheidet, ob es weitergeht | [src/chain](packages/connect-chain/src/chain/README.md) |

Die Übung zum Adapter liegt in [introduction-nodejs](https://github.com/MikeBild/introduction-nodejs/tree/HEAD/EXAMPLES/ARCHITECTURE).

### Austauschen und erzeugen – `packages/swap-create`

Die Decorator- und die Factory-Übung bauen auf Express 5 auf.

| Nr. | Pattern | Lektion | Übung |
| --- | --- | --- | --- |
| 04 | Decorator | Verhalten hinzufügen, ohne die Funktion anzufassen | [src/decorator](packages/swap-create/src/decorator/README.md) |
| 05 | Strategy, Command | Verhalten ist ein Argument | [src/strategy-command](packages/swap-create/src/strategy-command/README.md) |
| 06 | Factory | Eine Funktion baut, der Rest benutzt | [src/factory](packages/swap-create/src/factory/README.md) |

### Teilen und reagieren – `packages/share-react`

Die Provider-Übung läuft in React 19, Apollo Server 5 und Node.js.

| Nr. | Pattern | Lektion | Übung |
| --- | --- | --- | --- |
| 07 | Provider, Context | Ein Wert für den ganzen Baum oder Request | [src/provider-context](packages/share-react/src/provider-context/README.md) |
| 08 | Observer, State Machine | Wer abonniert, wird benachrichtigt | [src/observer-state](packages/share-react/src/observer-state/README.md) |
| 09 | – | Wann ein Pattern zu viel ist | [src/when-not](packages/share-react/src/when-not/README.md) |

## Workshop und Folien

- Workshop: [„Design Patterns als Funktionen“](https://workshops.mikebild.dev/w/design-patterns/remote/)
- Folien: [slides.mikebild.dev/introduction-design-patterns](https://slides.mikebild.dev/introduction-design-patterns.html)
- PDF: [slides.mikebild.dev/introduction-design-patterns.pdf](https://slides.mikebild.dev/introduction-design-patterns.pdf)

## Lizenz

[MIT](LICENSE)
