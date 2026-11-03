# Promotor Finder – System Wyboru Tematów Prac Dyplomowych

System wspomagający i automatyzujący proces wyboru tematów prac dyplomowych (inżynierskich i magisterskich), tworzenia grup projektowych oraz generowania Kart Zgłoszenia Pracy Dyplomowej na uczelni.

## Stos Technologiczny (Tech Stack)

### **Frontend (Aktualnie rozwijany)**

* **Core:** React 18, TypeScript, Vite

* **Routing:** React Router v6 (z routingiem dynamicznym)

* **Stylizowanie:** Tailwind CSS / CSS Modules

* **Jakość kodu:** ESLint, TypeScript Compiler (`tsconfig`)

### **Backend (Planowany)**

* **Core:** Java 21 / Spring Boot 3

* **Baza Danych:** PostgreSQL + Spring Data JPA (Hibernate)

* **Bezpieczeństwo & Auth:** Spring Security (OAuth2 / SSO w domenie `@polsl.pl`)

* **Obsługa Plików:** Apache POI (import/eksport Excel), OpenPDF/iText (generowanie Kart PDF)

* **Harmonogram & E-mail:** Spring Task Scheduler (`@Scheduled`), Spring Mail

## Uruchomienie Projektu Lokalnie

### Wymagania wstępne

* **Node.js** (wersja `>= 18.x`)

* **npm** (wersja `>= 9.x`)

### Krok po kroku

1. **Sklonuj repozytorium:**

   ```
   git clone <URL_REPOZYTORIUM>
   cd Promotor_Finder
   
   ```

2. **Zainstaluj zależności:**

   ```
   npm install
   
   ```

3. **Uruchom serwer deweloperski (Vite):**

   ```
   npm run dev
   
   ```

   Aplikacja będzie dostępna pod adresem: `http://localhost:5173/student`

4. **Budowanie wersji produkcyjnej:**

   ```
   npm run build
   
   ```

## Mapowanie Etapów i Ról w Systemie

System docelowo obsługuje 3 główne role użytkowników:

1. **Student:**

   * Dobieranie się w grupy projektowe (Inż. INF / IDiSI).

   * Wybór tematów indywidualnych lub grupowych (z uwzględnieniem rankingu średnich ocen).

   * Wysyłanie prośby o dodanie slotu/zwiększenie limitu.

   * Generowanie i podgląd Karty Zgłoszenia Pracy.

2. **Promotor:**

   * Zarządzanie limitami prac na dany kierunek/stopień.

   * Modyfikacja tematów, ustawianie rezerwacji oraz propozycji promotorów pomocniczych.

   * Zatwierdzanie grup i Kart Zgłoszeń.

3. **Administrator / Kierownik Katedry:**

   * Zarządzanie harmonogramem etapów (okna czasowe wyboru).

   * Import/Eksport danych z plików Excel.

   * Akceptacja/odrzucanie tematów przez Kierownika Katedry (Etap 1.5).

   * Automatyczna i ręczna wysyłka powiadomień e-mail.

## Licencja

Projekt realizowany na potrzeby Matematyki Stosowanej Politechniki Śląskiej.