import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  scrollable?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder,
  scrollable = false
}) => {
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable ? { 
    horizontal: true, 
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: styles.scrollContainer
  } : {};

  return (
    <View style={styles.wrapper}>
      {placeholder && !selectedValue && (
        <Text style={styles.placeholder}>{placeholder}</Text>
      )}
      <Container {...containerProps} style={scrollable ? styles.scrollView : styles.container}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.segment,
              selectedValue === option.value && styles.selectedSegment
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text 
              style={[
                styles.segmentText,
                selectedValue === option.value && styles.selectedSegmentText
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  scrollView: {
    flexDirection: 'row',
    marginTop: 4,
  },
  scrollContainer: {
    paddingRight: 8,
  },
  segment: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedSegment: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  segmentText: {
    color: '#333',
    fontSize: 14,
  },
  selectedSegmentText: {
    color: 'white',
    fontWeight: '500',
  },
  placeholder: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
});