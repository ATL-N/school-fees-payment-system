import React, { useEffect, useState } from 'react'

import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';

import image from "../../../resources/logo transparent.png";


export const ClassResultPDF = ({ classGradeResult, distinctSubjects, className, academicYear, semester, classId }) => {
  
  // Define a custom stylesheet for PDF rendering
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 20,
      backgroundColor: 'white',
    },
    header: {
      position: 'relative',
      top: 15,
      left: 5,
      right: 5,
      fontSize: 24,
      marginBottom: 10,
      marginTop: 10,
      textAlign: "center",
      textDecoration: "underline",
    },
    headerImage:{
      position: 'absolute',
      top: 10,
      left: 5,
      height:50,
      width:50
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
      textTransform: 'capitalize',   
     },
     logo: {
      position: "absolute",
      top: 5, // Adjust the position from the top
      left: 15, // Adjust the position from the left
      width: 50, // Adjust the width of the logo
      height: 50, // Adjust the height of the logo
    },
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
    <PDFViewer style={{ width: '100%', height: '80vh' }}>
      <Document >
      <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.headerImage}>
              <Image src={image} style={styles.logo} />
            </View>
            <View style={styles.header}>
              <Text>GREATER GRACE CHRISTIAN ACADEMY</Text>
              <Text>  </Text>
            </View>
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

// export default ClassResultPDF;
