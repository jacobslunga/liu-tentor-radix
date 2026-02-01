import { useState, useRef, useCallback, useEffect } from "react";
import { CHAT_API_URL, STREAM_UPDATE_INTERVAL } from "../constants";
import { Message } from "../types";

interface UseChatMessagesProps {
  examId: string | number;
  initialMessages?: Message[];
  examUrl: string;
  courseCode: string;
  solutionUrl?: string | null;
}

export interface UseChatMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (
    content: string,
    giveDirectAnswer: boolean,
    selectedModelId: string,
  ) => Promise<void>;
  cancelGeneration: () => string | null;
}

// const DEMO_MESSAGES: Message[] = [
//   {
//     role: "user",
//     content: "förklara fråga 1",
//   },
//   {
//     role: "assistant",
//     content: `
//     Här är förklaringen för uppgift 1:

// **1a) Formulera en linjär optimeringsmodell för att planera produktion och transporter.**

// **Variabler:**
// Låt $x_{ij}$ vara antalet enheter som transporteras från fabrik $i$ till affär $j$.
// Fabriker: $i \\in \\{1, 2\\}$
// Affärer: $j \\in \\{A, B, C\\}$

// **Målfunktion (maximera vinst):**
// Vinsten per enhet från fabrik $i$ till affär $j$ är försäljningspriset i affär $j$ minus transportkostnaden från fabrik $i$ till affär $j$.
// $$
// \\max \\quad (8000-250)x_{1A} + (8000-500)x_{2A} + (8600-300)x_{1B} + (8600-450)x_{2B} + (9500-600)x_{1C} + (9500-700)x_{2C}
// $$

// **Bivillkor:**
// 1.  **Produktionskapacitet för fabrik 1:**
//     $x_{1A} + x_{1B} + x_{1C} \\le 200$
// 2.  **Produktionskapacitet för fabrik 2:**
//     $x_{2A} + x_{2B} + x_{2C} \\le 250$
// 3.  **Icke-negativitet:**
//     $x_{1A}, x_{1B}, x_{1C}, x_{2A}, x_{2B}, x_{2C} \\ge 0$

// **1b) Vilken eller vilka av dessa figurer (M1, M2, M3) visar en korrekt minkostnadsflödesmodell för problemet i uppgift a)? Förklara på vilket sätt som kraven tas med eller missas i modellerna.**

// *   **M1 är inte korrekt.** Den kräver att all produktionskapacitet används, vilket strider mot problemet som säger att "Hela produktionskapaciteten måste inte användas".
// *   **M2 är korrekt.**
//     *   Den hanterar produktionskapaciteten genom bågar från en källa till nod 1 och 2 med kapacitet 200 respektive 250.
//     *   Intäkten hanteras som negativa kostnader på bågarna från affärsnoderna (A, B, C) till en sänka.
//     *   Transportkostnaderna är positiva kostnader på bågarna mellan fabriks- och affärsnoderna.
//     *   En "dummy"-båge från nod 1 och 2 till sänkan med kostnad 0 och kapacitet $M$ (stort tal) tillåter att oanvänd produktionskapacitet flödar ut utan kostnad.
//     *   Källan med styrkan -1000 och sänkan med styrkan 1000 säkerställer att det totala flödet är balanserat, och 1000 är ett tillräckligt stort tal för att inte begränsa det maximala möjliga flödet.
// *   **M3 är korrekt.** Den använder en annan struktur för flödesbalans men uppfyller samma krav som M2.

// **1c) Formulera den generella modellen som en linjär optimeringsmodell för $n$ fabriker och $m$ affärer.**

// **Variabler:**
// Låt $x_{ij}$ vara antalet enheter som transporteras från fabrik $i$ till affär $j$.
// Fabriker: $i \\in \\{1, \\dots, n\\}$
// Affärer: $j \\in \\{1, \\dots, m\\}$

// **Parametrar:**
// *   $c_{ij}$: transportkostnad från fabrik $i$ till affär $j$.
// *   $f_j$: försäljningspris i affär $j$.
// *   $s_i$: produktionskapacitet för fabrik $i$.

// **Målfunktion (maximera vinst):**
// $$
// \\max \\sum_{i=1}^{n} \\sum_{j=1}^{m} (f_j - c_{ij})x_{ij}
// $$

// **Bivillkor:**
// 1.  **Produktionskapacitet för varje fabrik $i$:**
//     $$
//     \\sum_{j=1}^{m} x_{ij} \\le s_i \\quad \\forall i \\in \\{1, \\dots, n\\}
//     $$
// 2.  **Icke-negativitet:**
//     $x_{ij} \\ge 0 \\quad \\forall i \\in \\{1, \\dots, n\\}, j \\in \\{1, \\dots, m\\}$

// **1d) Formulera problemet med mellanlager som en linjär optimeringsmodell.**

// **Variabler:**
// *   $y_k \\in \\{0, 1\\}$: binär variabel som är 1 om mellanlager $k$ byggs, 0 annars.
// *   $v_{ik}$: antalet enheter som transporteras från fabrik $i$ till mellanlager $k$.
// *   $w_{kj}$: antalet enheter som transporteras från mellanlager $k$ till affär $j$.

// **Parametrar:**
// *   $c_{ij}$: transportkostnad från fabrik $i$ till affär $j$ (om direkt transport tillåts, annars utelämnas).
// *   $f_j$: försäljningspris i affär $j$.
// *   $s_i$: produktionskapacitet för fabrik $i$.
// *   $b_k$: kostnad för att bygga mellanlager $k$.
// *   $d_{ik}$: transportkostnad från fabrik $i$ till mellanlager $k$.
// *   $e_{kj}$: transportkostnad från mellanlager $k$ till affär $j$.
// *   $M$: ett stort tal (för att koppla $v_{ik}$ och $w_{kj}$ till $y_k$).

// **Målfunktion (maximera vinst):**
// $$
// \\max \\sum_{k=1}^{p} \\sum_{j=1}^{m} (f_j - e_{kj})w_{kj} - \\sum_{i=1}^{n} \\sum_{k=1}^{p} d_{ik}v_{ik} - \\sum_{k=1}^{p} b_k y_k
// $$
// (Notera att den ursprungliga formuleringen i facit inkluderar $x_{ij}$ som direkttransport, men problemet beskriver att tåg används *till* mellanlagren och sedan *från* mellanlagren. Jag antar att all transport går via mellanlager, annars skulle $x_{ij}$ behöva definieras som direkttransport och inkluderas i målfunktion och kapacitetsvillkor.)

// **Bivillkor:**
// 1.  **Produktionskapacitet för varje fabrik $i$:**
//     $$
//     \\sum_{k=1}^{p} v_{ik} \\le s_i \\quad \\forall i \\in \\{1, \\dots, n\\}
//     $$
// 2.  **Flödesbalans för varje mellanlager $k$:**
//     $$
//     \\sum_{i=1}^{n} v_{ik} = \\sum_{j=1}^{m} w_{kj} \\quad \\forall k \\in \\{1, \\dots, p\\}
//     $$
// 3.  **Koppling mellan transport och byggda mellanlager:**
//     $$
//     \\sum_{i=1}^{n} v_{ik} \\le M y_k \\quad \\forall k \\in \\{1, \\dots, p\\}
//     $$
//     (Detta villkor säkerställer att flöde endast kan passera genom mellanlager $k$ om det byggs ($y_k=1$). Ett liknande villkor kan behövas för $w_{kj}$ om $M$ inte är tillräckligt stort för att täcka både in- och utflöde, men oftast räcker det med ett av dem.)
// 4.  **Icke-negativitet och binära variabler:**
//     $v_{ik} \\ge 0 \\quad \\forall i, k$
//     $w_{kj} \\ge 0 \\quad \\forall k, j$
//     $y_k \\in \\{0, 1\\} \\quad \\forall k$
//     `.trim(),
//   },
//   {
//     role: "user",
//     content: "förklara fråga 2",
//   },
//   {
//     role: "assistant",
//     content: `Här är en djupgående förklaring av uppgift 2:

// ---

// ### Uppgift 2

// Betrakta följande linjära optimeringsproblem:
// max $z = 2x_1 + 5x_2 + 3x_3$
// då
// $-x_1 + x_2 - x_3 \\le 3$ (1)
// $4x_1 + 2x_2 + x_3 \\le 9$ (2)
// $x_1, x_2, x_3 \\ge 0$

// ---

// #### a) Lös problemet med simplexmetoden. Vilken blir optimallösningen?

// **Steg 1: Konvertera till standardform och sätt upp initialt tableau.**
// Vi introducerar slackvariabler $s_1 \\ge 0$ och $s_2 \\ge 0$ för att omvandla olikheterna till likheter.
// max $z = 2x_1 + 5x_2 + 3x_3 + 0s_1 + 0s_2$
// då
// $-x_1 + x_2 - x_3 + s_1 = 3$
// $4x_1 + 2x_2 + x_3 + s_2 = 9$
// $x_1, x_2, x_3, s_1, s_2 \\ge 0$

// Initialt simplex-tableau (med $s_1$ och $s_2$ som basvariabler):
// $$
// \\begin{array}{c|cccccc|c}
// \\text{Bas} & z & x_1 & x_2 & x_3 & s_1 & s_2 & b \\\\
// \\hline
// z & 1 & -2 & -5 & -3 & 0 & 0 & 0 \\\\
// s_1 & 0 & -1 & 1 & -1 & 1 & 0 & 3 \\\\
// s_2 & 0 & 4 & 2 & 1 & 0 & 1 & 9 \\\\
// \\end{array}
// $$

// **Steg 2: Iteration 1.**
// 1.  **Inkommande variabel:** Välj variabeln med den mest negativa reducerade kostnaden i $z$-raden. Här är det $x_2$ med $-5$.
// 2.  **Utgående variabel:** Utför kvottestet (högerled / koefficient i inkommande kolumn, endast för positiva koefficienter).
//     *   För $s_1$: $3/1 = 3$
//     *   För $s_2$: $9/2 = 4.5$
//     Den minsta kvoten är $3$, så $s_1$ är den utgående variabeln. Pivotelementet är $1$ (i rad $s_1$, kolumn $x_2$).
// 3.  **Pivotering:** Utför radoperationer för att göra pivotelementet till $1$ och övriga element i kolumnen till $0$.
//     *   Den nya $x_2$-raden blir den gamla $s_1$-raden.
//     *   Ny $z$-rad: Gamla $z$-raden $+ 5 \\times$ nya $x_2$-raden.
//     *   Ny $s_2$-rad: Gamla $s_2$-raden $- 2 \\times$ nya $x_2$-raden.

// Tableau efter iteration 1 (basvariabler $x_2, s_2$):
// $$
// \\begin{array}{c|cccccc|c}
// \\text{Bas} & z & x_1 & x_2 & x_3 & s_1 & s_2 & b \\\\
// \\hline
// z & 1 & -7 & 0 & -8 & 5 & 0 & 15 \\\\
// x_2 & 0 & -1 & 1 & -1 & 1 & 0 & 3 \\\\
// s_2 & 0 & 6 & 0 & 3 & -2 & 1 & 3 \\\\
// \\end{array}
// $$

// **Steg 3: Iteration 2.**
// 1.  **Inkommande variabel:** Mest negativa reducerade kostnaden i $z$-raden är $-8$ (under $x_3$). $x_3$ är inkommande.
// 2.  **Utgående variabel:** Kvottestet.
//     *   För $x_2$: $3/(-1)$ (ej tillåten, negativ koefficient).
//     *   För $s_2$: $3/3 = 1$.
//     Den minsta kvoten är $1$, så $s_2$ är den utgående variabeln. Pivotelementet är $3$ (i rad $s_2$, kolumn $x_3$).
// 3.  **Pivotering:**
//     *   Ny $x_3$-rad: Gamla $s_2$-raden $/ 3$.
//     *   Ny $z$-rad: Gamla $z$-raden $+ 8 \\times$ nya $x_3$-raden.
//     *   Ny $x_2$-rad: Gamla $x_2$-raden $+ 1 \\times$ nya $x_3$-raden.

// Tableau efter iteration 2 (basvariabler $x_2, x_3$):
// $$
// \\begin{array}{c|cccccc|c}
// \\text{Bas} & z & x_1 & x_2 & x_3 & s_1 & s_2 & b \\\\
// \\hline
// z & 1 & 9 & 0 & 0 & -1/3 & 8/3 & 23 \\\\
// x_2 & 0 & 1 & 1 & 0 & 1/3 & 1/3 & 4 \\\\
// x_3 & 0 & 2 & 0 & 1 & -2/3 & 1/3 & 1 \\\\
// \\end{array}
// $$

// **Steg 4: Iteration 3.**
// 1.  **Inkommande variabel:** Det finns fortfarande en negativ reducerad kostnad i $z$-raden: $-1/3$ (under $s_1$). $s_1$ är inkommande.
// 2.  **Utgående variabel:** Kvottestet.
//     *   För $x_2$: $4 / (1/3) = 12$.
//     *   För $x_3$: $1 / (-2/3)$ (ej tillåten, negativ koefficient).
//     Den minsta kvoten är $12$, så $x_2$ är den utgående variabeln. Pivotelementet är $1/3$ (i rad $x_2$, kolumn $s_1$).
// 3.  **Pivotering:**
//     *   Ny $s_1$-rad: Gamla $x_2$-raden $/ (1/3) = 3 \\times$ gamla $x_2$-raden.
//     *   Ny $z$-rad: Gamla $z$-raden $+ (1/3) \\times$ nya $s_1$-raden.
//     *   Ny $x_3$-rad: Gamla $x_3$-raden $+ (2/3) \\times$ nya $s_1$-raden.

// Tableau efter iteration 3 (basvariabler $s_1, x_3$):
// $$
// \\begin{array}{c|cccccc|c}
// \\text{Bas} & z & x_1 & x_2 & x_3 & s_1 & s_2 & b \\\\
// \\hline
// z & 1 & 10 & 1 & 0 & 0 & 3 & 27 \\\\
// s_1 & 0 & 3 & 3 & 0 & 1 & 1 & 12 \\\\
// x_3 & 0 & 4 & 2 & 1 & 0 & 1 & 9 \\\\
// \\end{array}
// $$

// **Steg 5: Optimal lösning.**
// Alla reducerade kostnader i $z$-raden är nu icke-negativa. Lösningen är optimal.
// *   $x_1 = 0$ (icke-basvariabel)
// *   $x_2 = 0$ (icke-basvariabel)
// *   $x_3 = 9$ (basvariabel)
// *   $s_1 = 12$ (basvariabel)
// *   $s_2 = 0$ (icke-basvariabel)

// Optimallösningen är $x_1 = 0, x_2 = 0, x_3 = 9$ med målfunktionsvärdet $z = 27$.

// ---

// #### b) Om vi får möjlighet att öka högerledet till något av bivillkoret med en enhet, vilket är mest fördelaktigt att välja?

// Detta handlar om **skuggpriser** (dualvariabler). Skuggpriset för ett bivillkor anger hur mycket målfunktionsvärdet ändras om högerledet i det bivillkoret ökar med en enhet, förutsatt att basen inte ändras. För ett maximeringsproblem är det mest fördelaktigt att öka högerledet för det bivillkor som har det största positiva skuggpriset.

// Skuggpriserna för bivillkoren kan avläsas från koefficienterna för slackvariablerna i $z$-raden i den optimala tablån:
// *   Bivillkor 1: $-x_1 + x_2 - x_3 \\le 3$. Slackvariabeln är $s_1$. Dess koefficient i $z$-raden är $0$. Alltså är skuggpriset för bivillkor 1: $y_1 = 0$.
// *   Bivillkor 2: $4x_1 + 2x_2 + x_3 \\le 9$. Slackvariabeln är $s_2$. Dess koefficient i $z$-raden är $3$. Alltså är skuggpriset för bivillkor 2: $y_2 = 3$.

// Eftersom $y_2 = 3 > y_1 = 0$, är det mest fördelaktigt att öka högerledet i **bivillkor 2** med en enhet. Detta skulle öka målfunktionsvärdet med $3$ enheter.

// ---

// #### c) Skulle det vara fördelaktigt att lägga till en variabel med målfunktionskoefficient 2 och bivillkorskoefficienter (1, 1)?

// För att avgöra om det är fördelaktigt att lägga till en ny variabel, beräknar vi dess **reducerade kostnad**. För ett maximeringsproblem är det fördelaktigt om den reducerade kostnaden är positiv.

// Den reducerade kostnaden $\\bar{c}_{ny}$ för en ny variabel $x_{ny}$ med målfunktionskoefficient $c_{ny}$ och bivillkorskoefficientvektor $\\mathbf{a}_{ny}$ beräknas som:
// $\\bar{c}_{ny} = c_{ny} - \\mathbf{y}^T \\mathbf{a}_{ny}$
// där $\\mathbf{y}$ är vektorn av skuggpriser (dualvariabler) från den optimala lösningen.

// Vi har:
// *   Målfunktionskoefficient för den nya variabeln: $c_{ny} = 2$.
// *   Bivillkorskoefficienter för den nya variabeln: $\\mathbf{a}_{ny} = \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$ (dvs. $1$ i bivillkor 1 och $1$ i bivillkor 2).
// *   Skuggpriser från del b): $\\mathbf{y} = \\begin{pmatrix} y_1 \\\\ y_2 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 3 \\end{pmatrix}$.

// Beräkning av den reducerade kostnaden:
// $\\bar{c}_{ny} = 2 - \\begin{pmatrix} 0 & 3 \\end{pmatrix} \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$
// $\\bar{c}_{ny} = 2 - (0 \\cdot 1 + 3 \\cdot 1)$
// $\\bar{c}_{ny} = 2 - 3$
// $\\bar{c}_{ny} = -1$

// Eftersom den reducerade kostnaden $\\bar{c}_{ny} = -1$ är negativ (för ett maximeringsproblem), skulle det **inte** vara fördelaktigt att lägga till denna variabel. Att införa den skulle minska målfunktionsvärdet.`.trim(),
//   },
//   {
//     role: "user",
//     content: "fråga 3 också tack",
//   },
//   {
//     role: "assistant",
//     content: `Här är en djupgående förklaring av uppgift 3:

// ---

// ### Uppgift 3

// Betrakta följande olinjära optimeringsproblem.
// min $f(x) = 2x_1x_2 - x_1 - 2x_2$
// då
// $2x_1 + x_2 \\ge 5$ (1)
// $x_1 - x_2 \\le 4$ (2)

// ---

// #### a) Är problemet konvext?

// För att ett minimeringsproblem ska vara konvext måste målfunktionen vara konvex och det tillåtna området vara konvext.

// 1.  **Konvexitet hos målfunktionen $f(x)$:**
//     Vi beräknar Hessianmatrisen $\\nabla^2 f(x)$.
//     Först, gradienten $\\nabla f(x)$:
//     $$
//     \\nabla f(x) = \\begin{pmatrix} \\frac{\\partial f}{\\partial x_1} \\\\ \\frac{\\partial f}{\\partial x_2} \\end{pmatrix} = \\begin{pmatrix} 2x_2 - 1 \\\\ 2x_1 - 2 \\end{pmatrix}
//     $$
//     Sedan, Hessianmatrisen $\\nabla^2 f(x)$:
//     $$
//     \\nabla^2 f(x) = \\begin{pmatrix} \\frac{\\partial^2 f}{\\partial x_1^2} & \\frac{\\partial^2 f}{\\partial x_1 \\partial x_2} \\\\ \\frac{\\partial^2 f}{\\partial x_2 \\partial x_1} & \\frac{\\partial^2 f}{\\partial x_2^2} \\end{pmatrix} = \\begin{pmatrix} 0 & 2 \\\\ 2 & 0 \\end{pmatrix}
//     $$
//     För att $f(x)$ ska vara konvex måste $\\nabla^2 f(x)$ vara positivt semidefinit. Vi kan kontrollera egenvärdena. Egenvärdena $\\lambda$ ges av $\\det(\\nabla^2 f(x) - \\lambda I) = 0$:
//     $$
//     \\det \\begin{pmatrix} -\\lambda & 2 \\\\ 2 & -\\lambda \\end{pmatrix} = (-\\lambda)(-\\lambda) - (2)(2) = \\lambda^2 - 4 = 0
//     $$
//     Detta ger \\lambda^2 = 4, så \\lambda_1 = 2 och \\lambda_2 = -2.
//     Eftersom ett av egenvärdena är negativt (\\lambda_2 = -2), är Hessianmatrisen **inte** positivt semidefinit. Därför är målfunktionen $f(x)$ **inte konvex**.

// 2.  **Konvexitet hos det tillåtna området:**
//     Bivillkoren är linjära:
//     $g_1(x) = 2x_1 + x_2 \\ge 5$
//     $g_2(x) = x_1 - x_2 \\le 4$
//     Linjära bivillkor definierar alltid ett konvext tillåtet område.

// Eftersom målfunktionen inte är konvex, är hela optimeringsproblemet **inte konvext**.

// ---

// #### b) Är punkten $x = (3, -1)$ en KKT-punkt?

// Vi använder KKT-villkoren för ett minimeringsproblem med olikhetsbivillkor. Först skriver vi om bivillkoren till standardformen $g_i(x) \\le 0$:
// $g_1(x) = 5 - 2x_1 - x_2 \\le 0$
// $g_2(x) = x_1 - x_2 - 4 \\le 0$

// Vi behöver gradienterna:
// $\\nabla f(x) = \\begin{pmatrix} 2x_2 - 1 \\\\ 2x_1 - 2 \\end{pmatrix}$
// $\\nabla g_1(x) = \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix}$
// $\\nabla g_2(x) = \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix}$

// Låt oss testa punkten $x = (3, -1)$:

// 1.  **Primal tillåtenhet ($g_i(x) \\le 0$):**
//     $g_1(3, -1) = 5 - 2(3) - (-1) = 5 - 6 + 1 = 0$. Bivillkor 1 är aktivt.
//     $g_2(3, -1) = 3 - (-1) - 4 = 3 + 1 - 4 = 0$. Bivillkor 2 är aktivt.
//     Punkten är primalt tillåten.

// 2.  **Komplementär slackhet (\\mu_i g_i(x) = 0):**
//     Eftersom båda bivillkoren är aktiva ($g_1(x)=0$ och $g_2(x)=0$), ger detta ingen information om \\mu_1 och \\mu_2 från detta villkor. Både \\mu_1 och \\mu_2 kan vara noll eller positiva.

// 3.  **Stationaritet (\\nabla f(x) + \\mu_1 \\nabla g_1(x) + \\mu_2 \\nabla g_2(x) = 0):**
//     Sätt in $x = (3, -1)$:
//     $\\nabla f(3, -1) = \\begin{pmatrix} 2(-1) - 1 \\\\ 2(3) - 2 \\end{pmatrix} = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$
//     Ekvationen blir:
//     $$
//     \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix} + \\mu_1 \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix} + \\mu_2 \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}
//     $$
//     Detta ger ett ekvationssystem:
//     $-3 - 2\\mu_1 + \\mu_2 = 0 \\quad \\Rightarrow \\quad \\mu_2 = 2\\mu_1 + 3$ (A)
//     $4 - \\mu_1 - \\mu_2 = 0 \\quad \\Rightarrow \\quad \\mu_2 = 4 - \\mu_1$ (B)

//     Sätt (A) och (B) lika:
//     $2\\mu_1 + 3 = 4 - \\mu_1$
//     $3\\mu_1 = 1$
//     \\mu_1 = 1/3

//     Sätt in \\mu_1 = 1/3 i (B):
//     \\mu_2 = 4 - 1/3 = 11/3

// 4.  **Dual tillåtenhet (\\mu_i \\ge 0):**
//     \\mu_1 = 1/3 \\ge 0$
//     \\mu_2 = 11/3 \\ge 0$
//     Båda dualvariablerna är icke-negativa.

// Alla KKT-villkor är uppfyllda. Därför är punkten $x = (3, -1)$ en **KKT-punkt**.

// ---

// #### c) Finns det någon KKT-punkt där inget bivillkor är aktivt?

// Om inget bivillkor är aktivt, betyder det att $g_1(x) < 0$ och $g_2(x) < 0$.
// Enligt villkoret för komplementär slackhet (\\mu_i g_i(x) = 0), måste detta innebära att \\mu_1 = 0$ och \\mu_2 = 0$.

// Stationaritetsvillkoret förenklas då till \\nabla f(x) = 0:
// $$
// \\begin{pmatrix} 2x_2 - 1 \\\\ 2x_1 - 2 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}
// $$
// Detta ger ekvationssystemet:
// $2x_2 - 1 = 0 \\quad \\Rightarrow \\quad x_2 = 1/2$
// $2x_1 - 2 = 0 \\quad \\Rightarrow \\quad x_1 = 1$

// Så den potentiella KKT-punkten är $x = (1, 1/2)$.
// Nu måste vi kontrollera om denna punkt uppfyller villkoret att inget bivillkor är aktivt (dvs. $g_1(x) < 0$ och $g_2(x) < 0$):
// $g_1(1, 1/2) = 5 - 2(1) - 1/2 = 5 - 2 - 0.5 = 2.5$.
// Men $g_1(1, 1/2) = 2.5$, vilket är $> 0$. Detta strider mot $g_1(x) \\le 0$.
// Eftersom $g_1(x)$ inte är uppfyllt, är punkten $x = (1, 1/2)$ inte ens primalt tillåten.

// Därför **finns det ingen KKT-punkt där inget bivillkor är aktivt**.

// ---

// #### d) Låt nu målfunktionen vara $2x_1x_2 - x_1 - bx_2$ där $b$ är en parameter. Finns det något värde på parametern $b$ så att punkten $x = (2,1)$ är en KKT-punkt? Om det finns ett sådant värde, ger detta ett globalt minimum?

// Den nya målfunktionen är $f(x) = 2x_1x_2 - x_1 - bx_2$.
// Dess gradient är:
// $$
// \\nabla f(x) = \\begin{pmatrix} 2x_2 - 1 \\\\ 2x_1 - b \\end{pmatrix}
// $$
// Bivillkoren är oförändrade:
// $g_1(x) = 5 - 2x_1 - x_2 \\le 0$
// $g_2(x) = x_1 - x_2 - 4 \\le 0$
// Gradienterna för bivillkoren är också oförändrade:
// $\\nabla g_1(x) = \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix}$
// $\\nabla g_2(x) = \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix}$

// Låt oss testa punkten $x = (2, 1)$:

// 1.  **Primal tillåtenhet ($g_i(x) \\le 0$):**
//     $g_1(2, 1) = 5 - 2(2) - 1 = 5 - 4 - 1 = 0$. Bivillkor 1 är aktivt.
//     $g_2(2, 1) = 2 - 1 - 4 = -3$. Bivillkor 2 är inaktivt.
//     Punkten är primalt tillåten.

// 2.  **Komplementär slackhet (\\mu_i g_i(x) = 0):**
//     Eftersom $g_2(2, 1) = -3 \\ne 0$, måste \\mu_2 = 0$.
//     Eftersom $g_1(2, 1) = 0$, kan \\mu_1 vara noll eller positiv.

// 3.  **Stationaritet (\\nabla f(x) + \\mu_1 \\nabla g_1(x) + \\mu_2 \\nabla g_2(x) = 0):**
//     Sätt in $x = (2, 1)$ och \\mu_2 = 0:
//     $\\nabla f(2, 1) = \\begin{pmatrix} 2(1) - 1 \\\\ 2(2) - b \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 4 - b \\end{pmatrix}$
//     Ekvationen blir:
//     $$
//     \\begin{pmatrix} 1 \\\\ 4 - b \\end{pmatrix} + \\mu_1 \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix} + 0 \\cdot \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}
//     $$
//     Detta ger ekvationssystemet:
//     $1 - 2\\mu_1 = 0 \\quad \\Rightarrow \\quad \\mu_1 = 1/2$
//     $4 - b - \\mu_1 = 0$

//     Sätt in \\mu_1 = 1/2 i den andra ekvationen:
//     $4 - b - 1/2 = 0$
//     $4 - 1/2 = b$
//     $b = 7/2$

// 4.  **Dual tillåtenhet (\\mu_i \\ge 0):**
//     \\mu_1 = 1/2 \\ge 0$
//     \\mu_2 = 0 \\ge 0$
//     Båda dualvariablerna är icke-negativa.

// Ja, det finns ett värde på parametern $b$, nämligen $b = 7/2$, så att punkten $x = (2, 1)$ är en KKT-punkt.

// **Ger detta ett globalt minimum?**
// I del a) konstaterade vi att problemet inte är konvext eftersom målfunktionen inte är konvex (Hessianmatrisen hade negativa egenvärden). För icke-konvexa problem garanterar en KKT-punkt **inte** ett globalt minimum. Den kan vara ett lokalt minimum, ett lokalt maximum, eller en sadelpunkt. Utan ytterligare analys (t.ex. genom att kontrollera andra ordningens villkor eller genom att undersöka målfunktionen i närheten av punkten) kan vi inte säga om det är ett globalt minimum.`.trim(),
//   },
// ];

export const useChatMessages = ({
  examId,
  examUrl,
  courseCode,
  solutionUrl,
  initialMessages = [],
}: UseChatMessagesProps): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>(initialMessages);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const cancelGeneration = useCallback((): string | null => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    let cancelledUserMessage: string | null = null;

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant") {
        if (!last.content.trim()) {
          const userMsg = prev[prev.length - 2];
          if (userMsg?.role === "user") {
            cancelledUserMessage = userMsg.content;
          }
          if (prev.length === 2) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: "> *Avbruten av användaren*",
            };
            return updated;
          }
          return prev.slice(0, -2);
        } else {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: last.content.trim() + "\n\n> *Avbruten av användaren*",
          };
          return updated;
        }
      }
      return prev;
    });

    setIsLoading(false);
    return cancelledUserMessage;
  }, []);

  const sendMessage = useCallback(
    async (
      content: string,
      giveDirectAnswer: boolean,
      selectedModelId: string,
    ) => {
      if (!content.trim() || isLoadingRef.current) return;

      const userMessage: Message = { role: "user", content };

      const optimistic: Message[] = [
        ...messagesRef.current,
        userMessage,
        { role: "assistant", content: "" } as Message,
      ];

      setMessages(optimistic);
      messagesRef.current = optimistic;

      setIsLoading(true);
      isLoadingRef.current = true;

      abortControllerRef.current = new AbortController();

      try {
        const recentMessages = optimistic.slice(0, -1).slice(-10);

        const response = await fetch(`${CHAT_API_URL}/${examId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-anonymous-user-id":
              localStorage.getItem("liutentor_anonymous_id") || "unknown",
          },
          body: JSON.stringify({
            messages: recentMessages,
            giveDirectAnswer,
            examUrl,
            courseCode,
            solutionUrl: solutionUrl || undefined,
            modelId: selectedModelId,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error();

        const reader = response.body?.getReader();
        if (!reader) throw new Error();

        const decoder = new TextDecoder("utf-8");
        let text = "";
        let lastUpdate = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          text += decoder.decode(value, { stream: true });
          const now = Date.now();

          if (now - lastUpdate >= STREAM_UPDATE_INTERVAL) {
            lastUpdate = now;
            const updated = [...messagesRef.current];
            updated[updated.length - 1] = {
              role: "assistant",
              content: text,
            };
            setMessages(updated);
            messagesRef.current = updated;
          }
        }

        const final = [...messagesRef.current];
        final[final.length - 1] = {
          role: "assistant",
          content: text.trim() || "Jag kunde inte generera ett svar.",
        };

        setMessages(final);
        messagesRef.current = final;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        const updated = [...messagesRef.current];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Något gick fel. Försök igen senare.",
        };
        setMessages(updated);
        messagesRef.current = updated;
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [examId, examUrl, courseCode, solutionUrl],
  );

  return {
    messages,
    isLoading,
    sendMessage,
    cancelGeneration,
  };
};
