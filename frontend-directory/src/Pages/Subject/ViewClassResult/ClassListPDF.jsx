import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

export const ClassListPDF = ({ studentResults, className, numberOfColumns }) => {
  const newNumberOfColoumns = parseInt(numberOfColumns) + 2
  const width = `${parseInt(100/(newNumberOfColoumns))}%`
  console.log('numberOfColumns',newNumberOfColoumns, width)
  const renderTableHeader = () => {
    const headers = Array.from({ length: numberOfColumns }, (_, index) => (
      <Text key={index} style={styles.tableCell}>
        {/* Header {index + 1} */}
      </Text>
    ));
    return (
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Student Name</Text>
        <Text style={styles.tableCell}>Contact</Text>
        {headers}
      </View>
    );
  };

  const renderEmptyCells = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <Text key={index} style={styles.tableCell}>
        {/* Empty cell */}
      </Text>
    ));
  };

  const renderTableRows = () => {
    return studentResults.map((result) => (
      <View key={result.StudentID} style={styles.tableRow}>
        <Text style={styles.tableCell}>{result.StudentName}</Text>
        <Text style={styles.tableCell}>{result.Contact}</Text>
        {renderEmptyCells(numberOfColumns)}
      </View>
    ));
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 20,
      backgroundColor: 'white',
    },
    header: {
      fontSize: 24,
      marginBottom: 10,
    },
    table: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
    },
    tableRow: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottom: 1,
    },
    tableCell: {
      width: width,
      textAlign: 'center',
      borderRight: 1,
      fontSize: 13
    },
    grayBackground: {
      backgroundColor: '#f5f5f5',
    },
    textName: {
      marginBottom: 10,
      textAlign: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
      textTransform: 'capitalize',
    },
  });
  

  return (
    <PDFViewer style={{ width: '100%', height: '90vh' }}>
      <Document>
        <Page size="A4" style={styles.page} orientation="landscape">
          <Text style={styles.title}>Greater Grace Christian Academy</Text>
          <Text style={styles.textName}>Class: {className}</Text>

          <View style={styles.table}>
            {renderTableHeader()}
            {renderTableRows()}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
