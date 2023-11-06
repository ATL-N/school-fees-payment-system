import React, { useEffect, useState } from 'react'

import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

export const ClassEmptyListPDF = ({ classGradeResult, distinctSubjects, className, academicYear, semester, classId }) => {
  
  // Define a custom stylesheet for PDF rendering
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
      width: '100%',
      border: '1 solid black',
      borderBottom: 2,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: 1,
    },
    tableCell: {
      width: '25%',
      padding: 5,
      textAlign: 'center',
    },

    verticalLine: {
      borderRight: 1, 
    },

    verticalLine2: {
      borderRight: 3, 
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
      textTransform: 'capitalize',    },
  });

  const handlePrint = () => {
    window.print();
  };

  // Define a function to render the table rows
  const renderTableRows = () => {
    
    return classGradeResult.map((result) => (
      <View key={result.StudentName} style={[styles.tableRow ]}>
        <Text style={[styles.tableCell, styles.verticalLine2, styles.grayBackground]}>{result.StudentName}</Text>
        {distinctSubjects.map((subject) => (
          <Text key={subject} style={[styles.tableCell, styles.verticalLine]}>
            {result[subject]}
          </Text>
        ))}
        <Text style={[styles.tableCell, styles.verticalLine, styles.grayBackground]}>{result.total}</Text>
        <Text style={[styles.tableCell, styles.grayBackground]}>{result.position}</Text>
      
      </View>
    ));
    
  };

  return (
    <PDFViewer style={{ width: '100%', height: '90vh' }}>
      <Document >
      <Page size="A4" style={styles.page} orientation="landscape">
          <Text style={styles.title}>
            greater grace christian academy
          </Text>
          <Text style={styles.textName}>
            Class: {className}   Year: {academicYear}, term: {semester}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Student Name</Text>
              {distinctSubjects.map((subject) => (
                <Text key={subject} style={styles.tableCell}>
                  {subject}
                </Text>
              ))}
              <Text style={styles.tableCell}>Total Score</Text>
              <Text style={styles.tableCell}>Position</Text>
            </View>
            {renderTableRows()}
          </View>

        </Page>
      </Document>
    </PDFViewer>
  );

};

// export default ClassEmptyListPDF;
