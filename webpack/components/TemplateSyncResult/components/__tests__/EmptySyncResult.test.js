import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmptySyncResult from '../EmptySyncResult';

it('renders the empty sync result and runs the primary action', () => {
  const primaryAction = jest.fn();
  render(<EmptySyncResult primaryAction={primaryAction} />);

  expect(
    screen.getByRole('heading', { name: 'No Template Sync Result' })
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'To view results of a template sync, you must import/export the templates first.'
    )
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Sync Templates' }));
  expect(primaryAction).toHaveBeenCalledTimes(1);
});
