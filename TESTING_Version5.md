# Testing Guide for COMPANIONAPP

Welcome to the testing documentation for COMPANIONAPP! This guide explains how to write, run, and maintain tests for your modular React + TypeScript codebase.

---

## Philosophy

- **Reliability:** Components and logic should be covered by automated tests.
- **Modularity:** Each feature/component should have its own test file.
- **Collaboration:** Test coverage makes contributions safer and more transparent.
- **User-first:** Tests should reflect real user flows (unit, integration, E2E).

---

## Tools

- **Unit/Integration:** [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **End-to-End (E2E):** [Cypress](https://www.cypress.io/) (optional, recommended for user flows)

---

## File & Folder Structure

- Unit/integration tests: `__tests__/` subfolder or side-by-side as `ComponentName.test.tsx`
  - Example: `src/components/DiceRoller/DiceRoller.test.tsx`
- E2E tests: `cypress/e2e/`

---

## Running Tests

### Unit/Integration

```bash
npm test
```
or
```bash
yarn test
```

### E2E (Cypress)

```bash
npx cypress open
```
or
```bash
npx cypress run
```

---

## Writing Tests

### Example: DiceRoller Component (Jest + React Testing Library)

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DiceRoller from './DiceRoller';

describe('DiceRoller', () => {
  it('renders dice buttons and history', () => {
    render(<DiceRoller
      character={{ attributes: { reason: 10, empathy: 10, resolve: 10, intuition: 10, vigor: 10 } }}
      concordancePool={6}
      hopeTokens={3}
      rollHistory={[]}
      rollDice={jest.fn()}
      concordanceRoll={jest.fn()}
      setConcordancePool={jest.fn()}
      setHopeTokens={jest.fn()}
    />);
    expect(screen.getByText(/d20/i)).toBeInTheDocument();
    expect(screen.getByText(/Roll Pool/i)).toBeInTheDocument();
    expect(screen.getByText(/Roll History/i)).toBeInTheDocument();
  });

  it('calls rollDice when d20 button is clicked', () => {
    const rollDiceMock = jest.fn();
    render(<DiceRoller
      character={{ attributes: { reason: 10, empathy: 10, resolve: 10, intuition: 10, vigor: 10 } }}
      concordancePool={6}
      hopeTokens={3}
      rollHistory={[]}
      rollDice={rollDiceMock}
      concordanceRoll={jest.fn()}
      setConcordancePool={jest.fn()}
      setHopeTokens={jest.fn()}
    />);
    fireEvent.click(screen.getByText(/d20/i));
    expect(rollDiceMock).toHaveBeenCalledWith(20, 1, 0, 'd20');
  });
});
```

---

### Example: E2E Test (Cypress)

```javascript
// cypress/e2e/diceRoller.cy.js
describe('Dice Roller', () => {
  it('displays dice roller and rolls dice', () => {
    cy.visit('/');
    cy.contains('Dice Roller').click();
    cy.contains('d20').click();
    cy.contains('Roll History');
  });
});
```

---

## Coverage

Check your coverage after running tests:

```bash
npm test -- --coverage
```

Coverage reports appear in `/coverage`.

---

## CI Integration

- Ensure your CI (GitHub Actions, etc.) runs tests on PRs.
- Example workflow: `.github/workflows/test.yml`

---

## Best Practices

- **Test core features:** Each feature component should have at least one test.
- **Mock data:** Use `jest.fn()` for required props in component tests.
- **Write user-centric tests:** Prefer queries like `getByRole`, `getByText`, etc.
- **Avoid implementation details:** Test behavior, not internals.
- **Keep tests up to date:** Update tests when feature logic changes.

---

## Troubleshooting

- If a test fails, check the error output for missing props or changes in component structure.
- For async UI updates, use `waitFor` or `findBy*` queries.
- If coverage is low, write additional tests or refactor for testability.

---

## Contributing

- New features/components should include matching test files.
- PRs without relevant tests may be flagged for review.

---

## Questions?

Open a GitHub issue in [COMPANIONAPP](https://github.com/synapsecomics/COMPANIONAPP/issues) or ask in crew chat.

<8>