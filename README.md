# PokedexV2Angular

This web application is a proof of concept. It offers an ability to browse Pokemons fictional creatures that inhabit the fictional Pokemon World.

## Features
* **Browse Pokemon List**: View a paginated list of Pokemons.
* **Basic Pokemon Details**: Display essential information for each Pokemon, including ID, name, image, and types.

## Architecture
The project follows a modular architecture, with emphasis on separation of concerns. This design was implemented to facilitate testability, simulate collaborative workflow and reduced build times.

Key architectural layers and their rationale:
* **`:app`** - The application's entry point, primarily responsible for application-level setup, global configuration (`app.config.ts`), and handling root-level navigation via `RouterOutlet`. It orchestrates the loading of feature modules.
* **`:feature`** - This is the primary module for organizing the application by business domain (as of now: `pokemon`). Each feature is given a separate module (conceptually, `src/app/features/name-of-feature`). Within each feature, sub-folders represent the Clean Architecture layers:
  * **`domain`**: Contains the core business entities (models like `Pokemon`) and abstract repository interfaces (like `PokemonRepository` interface). Represents innermost, independent layer of the project.
  * **`application`**: Organizes data flow between the domain entities and abstract repositories, defining what operations the application can perform (like `GetPokemonListUseCase`. They depend only on the `domain` layer.
  * **`infrastructure`**: This layer handles all communication with external data sources (as of now: PokeAPI), providing concrete implementations for the abstract repository interfaces defined in the `domain` layer. It includes data transfer objects and mappers to translate between external data formats and the internal `domain` models. The intent behind this was to replace the global top level `:data` module by integrating it within each feature.
  * **`presentation`**: Contains user-facing UI elements, angular components, pages, and presentation logic. These components interact with the `application` layer (Use Cases) to trigger business logic and display the results. This layer is responsible for adapting data for UI display.

## Stack
* **TypeScript**: The core programming language
* **Frontend Framework**: Angular 
* **TailwindCSS**: Styling framework

## Getting started
1. Clone the repository git clone https://github.com/LukeKozielecki/PokedexAngular/
2. Open in Visual Studio Code / Webstorm / IDE of choice
3. Build and Run on a localhost server

## Licence
MIT License

Copyright (c) 2025 Lucjan Kozielecki

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
