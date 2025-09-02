# PokedexV2Angular

This web application is a comprehensive Pokédex that allows users to browse, edit and mark as favourites chosen Pokémon.

## Features
* **Browse through Pokemon list**: Search for a specific Pokemon with name or ID.
* **Browse Pokemon by Type/Subtype**: Filter Pokemons by their type.
* **Browse Pokemon Marked as Favourites**: For authenticated users, view a list of their favorite Pokemons.
* **Inspect Pokemon Details**: View comprehensive information for a Pokemon, including details, stats, evolution chain, and other Pokemons of a similar type.
* **Authentication**:
  * Register a / login to Firebase account
  * Change password
  * Send password reset link
* **Internationalization**: Browse Pokémon in Spanish or English.

## Architecture
The project follows a modular architecture, with emphasis on separation of concerns. This design was implemented to facilitate testability, simulate collaborative workflow and reduced build times.

Key architectural layers and their rationale:
* **`:app`** - The application's entry point, primarily responsible for application-level setup, global configuration (`app.config.ts`), and handling root-level navigation via `RouterOutlet`. It orchestrates the loading of feature modules.
* **`:feature`** - This is the primary module for organizing the application by business domain (like `pokemon`, `auth`). Each feature is given a separate module (`src/app/features/name-of-feature`). Within each feature, sub-folders represent the Architecture layers:
  * **`domain`**: Contains the core business entities (models like `Pokemon`) and abstract repository interfaces (like `PokemonRepository` interface). Represents innermost, independent layer of the project.
  * **`appalication`**: Organizes data flow between the domain entities and abstract repositories, defining what operations the application can perform (like 'GetPokemonListUseCase'. They depend only on the `domain` layer.
  * **`infrastructure`**: This layer handles all communication with external data sources (as of now: PokeAPI), providing concrete implementations for the abstract repository interfaces defined in the `domain` layer. It includes data transfer objects and mappers to translate between external data formats and the internal `domain` models. The intent behind this was to replace the global top level `:data` module by integrating it within each feature.
  * **`presentation`**: Contains user-facing UI elements, angular components, pages, and presentation logic. These components interact with the `application` layer (Use Cases) to trigger business logic and display the results. This layer is responsible for adapting data for UI display.

## Stack
* **Angular & TypeScript**: Angular provides the core frontend framework. TypeScript provides type safety and better code organization over pure JavaScript.
* **SCSS**: A CSS preprocessor for writing more maintainable stylesheets, over pure CSS.
* **Firebase**: Used as the backend to handle user authentication and user specific features.
* **Cypress**: An end-to-end testing facilitate clear and safe developer experience, and consistent end-user experience.

## Getting started
For english version:
1. Clone the repository
```
git clone https://github.com/LukeKozielecki/PokedexAngular/
```
2. Open in Visual Studio Code / Webstorm / IDE of choice
3. Build and Run on a localhost server

For *multi-language version*, please do set up a custom server. I would recommend https://www.npmjs.com/package/http-server, launched via this sequence from project root:
```
ng build --localize
cd dist/pokedex-v2-angular/browser
npx http-server -c-1 
```


## Licence
MIT License

Copyright (c) 2025 Lucjan Kozielecki

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
