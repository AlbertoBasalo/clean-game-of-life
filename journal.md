# Cleaning journal

## 1 - Style

- Install a tool like Prettier
`npm i -D prettier`

- Install a tool like ESLint
`npm i -D eslint eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser`

- Commented and dead code

- Folder src

## 2 - Name

- Variables and arguments
- Function names
- Magic numbers and strings
- comments

## 3 - Control

- Nested <=2
- Conditions (simplest and positive)
- Complexity (switches, ifs, responsibilities...)

## 4 - Function

- Try to not use global variables
- Do not change global variables
- Do not change your arguments
- Enclose every instruction in a initializing function
- Do not use fat arrow for first class functions
- Homogenize event handlers

## 5 - Data

- Avoid primitives in constant configuration
- Avoid primitives in global state