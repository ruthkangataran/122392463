import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormField from '../components/form-field';

describe('FormField', () => {
  it('renders the label and fires onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByText, getByLabelText } = render(
      <FormField label="Distance (km)" value="" onChangeText={onChangeText} />
    );

    expect(getByText('Distance (km)')).toBeTruthy();

    fireEvent.changeText(getByLabelText('Distance (km)'), '5.5');
    expect(onChangeText).toHaveBeenCalledWith('5.5');
  });
});
