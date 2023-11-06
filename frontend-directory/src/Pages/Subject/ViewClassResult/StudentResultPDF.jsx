import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Define the styles for your PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'landscape', // Set to landscape orientation
    size: 'A3', // Use A3 paper size
    paddingTop: 20,
    paddingRight: 40,
    paddingBottom: 20,
    paddingLeft: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  textName: {
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    width: '20%',
    border: '1px solid #000',
    padding: 5,
    textAlign: 'center',
  },
  grayBackground: {
    backgroundColor: '#f2f2f2',
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  total: {
    marginTop: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
});

export const StudentResultPDF = ({ studentId, academicYear, semester, studentResult, studentName, total, overallPosition }) => {
  return (
    <PDFViewer style={{ width: '100%', height: '80vh' }}>
      <Document>
        <Page size="A5" style={styles.page} orientation='landscape'>
          <Text style={styles.title}>
            GREATER GRACE CHRISTIAN ACADEMY
          </Text>
          <Text style={styles.textName}>
            NAME: {studentName}     YEAR: {academicYear}    Term: {semester}    
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.grayBackground, styles.tableHeader]}>Subject Name</Text>
              <Text style={styles.tableCell}>Class Score</Text>
              <Text style={styles.tableCell}>Exam Score</Text>
              <Text style={styles.tableCell}>Grade</Text>
              <Text style={[styles.tableCell, styles.grayBackground]}>Total Score</Text>
              <Text style={[styles.tableCell, styles.grayBackground]}>Position</Text>
            </View>
            {studentResult?.map((studentGrade) => (
              <View key={studentGrade.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.grayBackground]}>{studentGrade.SubjectName}</Text>
                <Text style={styles.tableCell}>{studentGrade.ClassScore}</Text>
                <Text style={styles.tableCell}>{studentGrade.ExamScore}</Text>
                <Text style={styles.tableCell}>{studentGrade.GradeName}</Text>
                <Text style={[styles.tableCell, styles.grayBackground]}>{studentGrade.TotalScore}</Text>
                <Text style={[styles.tableCell, styles.grayBackground]}>{studentGrade.StudentPosition}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.textName , styles.total]}>
            total score: {total}    overall Position: {overallPosition}
            </Text>
            <View>
              <Text style={[styles.textName ,]}>
              Class teacher's remark: .................................................................
              ......................................................................................................
              </Text>
              <Text style={[styles.textName ,]}>
              Head teacher's remark: .................................................................
              ......................................................................................................
              </Text>
            </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default StudentResultPDF;
