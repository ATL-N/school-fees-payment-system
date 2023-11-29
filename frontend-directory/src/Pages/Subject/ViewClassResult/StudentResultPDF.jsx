import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Define the styles for your PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'landscape', // Set to landscape orientation
    size: 'A3', // Use A3 paper size
    paddingTop: 20,
    paddingRight: 30,
    paddingBottom: 10,
    paddingLeft: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  textName: {
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 14,
  },
  textName1: {
    marginBottom: 5,
    textAlign: 'left',
    fontSize: 12,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    width: '20%',
    border: '1px solid #000',
    padding: 5,
    textAlign: 'center',
    fontSize: 15,

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

          <Text style={styles.textName}>
            attendace: {}/{}    overall Position: {overallPosition}   total score: {total}
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
                <Text style={[styles.tableCell, styles.grayBackground]}>{studentGrade.subjectname}</Text>
                <Text style={styles.tableCell}>{studentGrade.classscore}</Text>
                <Text style={styles.tableCell}>{studentGrade.examscore}</Text>
                <Text style={styles.tableCell}>{studentGrade.gradename}</Text>
                <Text style={[styles.tableCell, styles.grayBackground]}>{studentGrade.totalscore}</Text>
                <Text style={[styles.tableCell, styles.grayBackground]}>{studentGrade.studentposition}</Text>
              </View>
            ))}
          </View>
            <View>
              <Text style={[styles.textName1 ,]}>
              Class teacher's remark: ........................................................................................................................
              ........................................................................................................................................................
              </Text>
              <Text style={[styles.textName1 ,]}>
              Head teacher's remark: ..........................................................................................................................
              ........................................................................................................................................................
              </Text>
            </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default StudentResultPDF;
