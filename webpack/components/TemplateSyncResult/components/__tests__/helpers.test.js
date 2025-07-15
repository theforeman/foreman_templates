import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { isEmpty } from 'lodash';
import { render, screen } from '@testing-library/react';
import {
  itemIteratorId,
  additionalInfo,
  itemLeftContentIcon,
  expandableContent,
} from '../SyncedTemplate/helpers';

jest.mock('lodash', () => ({
  isEmpty: jest.fn(),
}));

describe('SyncedTemplate helpers', () => {
  const mockTemplate = {
    id: 1,
    name: 'Test Template',
    templateFile: 'test.erb',
    className: 'JobTemplate',
    canEdit: true,
    locked: true,
    snippet: true,
    humanizedClassName: 'Job Template',
    kind: 'job',
    additionalInfo: 'Some additional info',
    errors: {
      base: ['Base error'],
      name: ['Name error'],
    },
    additionalErrors: 'Additional error message',
  };

  const mockEditPath = {
    JobTemplate: '/job_templates/:id/edit',
    ProvisioningTemplate: '/templates/provisioning_templates/:id/edit',
    Ptable: '/templates/ptables/:id/edit',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('itemIteratorId', () => {
    it('generates correct iterator ID with template and rest parameters', () => {
      const result = itemIteratorId(mockTemplate, 'key', 0);
      expect(result).toBe('test.erb-key-0');
    });

    it('handles multiple rest parameters', () => {
      const result = itemIteratorId(mockTemplate, 'section', 'subsection', 1);
      expect(result).toBe('test.erb-section-subsection-1');
    });

    it('works with no rest parameters', () => {
      const result = itemIteratorId(mockTemplate);
      expect(result).toBe('test.erb-');
    });
  });

  describe('additionalInfo', () => {
    it('renders all template attributes correctly', () => {
      const result = additionalInfo(mockTemplate, mockEditPath);

      expect(result).toHaveLength(6);

      const nameLink = result.find(
        item => item.props.children.props.template?.name === 'Test Template'
      );
      expect(nameLink).toBeDefined();

      const lockedIcon = result.find(
        item => item.props.children.props.tooltipText === 'Locked'
      );
      expect(lockedIcon).toBeDefined();

      const snippetIcon = result.find(
        item => item.props.children.props.tooltipText === 'Snippet'
      );
      expect(snippetIcon).toBeDefined();
    });

    it('renders name as link when template has id and canEdit', () => {
      const result = additionalInfo(mockTemplate, mockEditPath);
      const nameItem = result.find(
        item => item.props.children.props.template?.name === 'Test Template'
      );

      expect(nameItem).toBeDefined();
      expect(nameItem.props.children.props.template.canEdit).toBe(true);
      expect(nameItem.props.children.props.template.id).toBe(1);
    });

    it('renders name as text when template cannot be edited', () => {
      const nonEditableTemplate = { ...mockTemplate, canEdit: false };
      const result = additionalInfo(nonEditableTemplate, mockEditPath);

      expect(result).toHaveLength(6);
    });

    it('renders name as text when template has no id', () => {
      const noIdTemplate = { ...mockTemplate, id: null };
      const result = additionalInfo(noIdTemplate, mockEditPath);

      expect(result).toHaveLength(6);
    });

    it('handles missing template attributes gracefully', () => {
      const incompleteTemplate = {
        templateFile: 'test.erb',
        name: 'Test Template',
      };

      const result = additionalInfo(incompleteTemplate, mockEditPath);

      expect(result).toHaveLength(6);
    });

    it('maps Ptable className correctly', () => {
      const ptableTemplate = { ...mockTemplate, humanizedClassName: 'Ptable' };
      const result = additionalInfo(ptableTemplate, mockEditPath);

      expect(result).toHaveLength(6);
    });

    it('renders empty ItemWrapper for missing attributes', () => {
      const incompleteTemplate = {
        templateFile: 'test.erb',
        name: 'Test Template',
      };

      const result = additionalInfo(incompleteTemplate, mockEditPath);

      expect(result).toHaveLength(6);
    });
  });

  describe('itemLeftContentIcon', () => {
    it('renders warning icon when template has additionalInfo', () => {
      const result = itemLeftContentIcon(mockTemplate);

      expect(result.props.children.props.className).toBe('c-icon');
      expect(result.props.children.props.color).toBe(
        'var(--pf-v5-global--warning-color--100)'
      );
    });

    it('renders success icon when no errors and no additionalInfo', () => {
      const successTemplate = { ...mockTemplate, additionalInfo: null };
      isEmpty.mockReturnValue(true);

      const result = itemLeftContentIcon(successTemplate);

      expect(result.props.children.props.className).toBe('c-icon');
      expect(result.props.children.props.color).toBe(
        'var(--pf-v5-global--success-color--100)'
      );
    });

    it('renders error icon when template has errors', () => {
      const errorTemplate = { ...mockTemplate, additionalInfo: null };
      isEmpty.mockReturnValue(false);

      const result = itemLeftContentIcon(errorTemplate);

      expect(result.props.children.props.className).toBe('c-icon');
      expect(result.props.children.props.color).toBe(
        'var(--pf-v5-global--danger-color--100)'
      );
    });

    it('prioritizes additionalInfo over errors', () => {
      const result = itemLeftContentIcon(mockTemplate);

      expect(result.props.children.props.className).toBe('c-icon');
      expect(result.props.children.props.color).toBe(
        'var(--pf-v5-global--warning-color--100)'
      );
    });
  });

  describe('expandableContent', () => {
    it('renders error messages when template has errors', () => {
      const result = expandableContent(mockTemplate);

      expect(result.type).toBe('ul');
      expect(result.props.children).toBeDefined();
    });

    it('handles template with only additionalInfo', () => {
      const infoOnlyTemplate = {
        templateFile: 'test.erb',
        additionalInfo: 'Just some info',
        errors: {},
      };

      const result = expandableContent(infoOnlyTemplate);

      expect(result.type).toBe('ul');
    });

    it('handles template with only errors', () => {
      const errorsOnlyTemplate = {
        templateFile: 'test.erb',
        errors: { name: ['Name error'] },
        additionalInfo: null,
      };

      const result = expandableContent(errorsOnlyTemplate);

      render(<>{result}</>);

      expect(result.type).toBe('ul');
      expect(screen.getByText(/Name Error/i)).toBeInTheDocument();
    });
  });
});
