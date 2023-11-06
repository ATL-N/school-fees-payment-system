import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import image from "../../resources/logo transparent.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
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
  receiptNumber: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 14,
    width: '60px',
    textDecoration: 'underline',
    fontWeight: 'extrabold'
  },
  headerImage:{
    position: 'absolute',
    top: 10,
    left: 5,
    height:50,
    width:50
  },
  body: {
    position: 'relative',
    margin: 10,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingLeft: 10
  },
  label: {
    fontSize: 14,
    width: '40%', // Adjust the width as needed for your label column

  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1
  },
  watermark: {
    position: "absolute",
    top: "170px",
    left: 50,
    right: 50,
    bottom: "50px",
    opacity: 0.3,
    textAlign: "center",
  },
  watermarkText: {
    fontSize: 30,
    color: "#ccc", // Adjust the color as needed
    transform: "rotate(-30deg)",
  },
  logo: {
    position: "absolute",
    top: 5, // Adjust the position from the top
    left: 5, // Adjust the position from the left
    width: 50, // Adjust the width of the logo
    height: 50, // Adjust the height of the logo
  },
  notification:{
    position: 'absolute',
    bottom: 5,
    textAlign: 'center',
    fontSize: 10,
    fontStyle: 'italic'
  }
});

// const Logo = () => (
//   <Image src="data:image/png;base64,/opt/lampp/htdocs/react-apps/school-fees-payment-system/frontend-directory/src/resources/logo transparent.png" style={styles.logo} />
// );

const Watermark = () => (
  <View style={styles.watermark}>
    <Text style={styles.watermarkText}>GREATER GRACE CHRISTIAN ACADEMY</Text>
  </View>
);

export const PaymentPDF = ({ results }) => {
  const paymentDate = new Date(results?.PaymentDate);
  let formattedPaymentDate;
  if (!isNaN(paymentDate)) {
    // const formattedDate = parsedDate.toISOString().split('T')[0];
    formattedPaymentDate = paymentDate.toISOString().split("T")[0]; // This will give you "2023-10-26"
  } else {
    formattedPaymentDate = paymentDate.toLocaleDateString(); // This will give you the date part as a string (e.g., "10/26/2023")
  }

  // Format money values as currency (Ghc)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHC",
    }).format(amount);
  };

  return (
    <PDFViewer style={{ width: "100%", height: "80vh" }}>
      <Document>
        <Page size="A5" style={styles.page} orientation="landscape">
          <Watermark />
          <View style={styles.section}>

            <View style={styles.receiptNumber}> 
              <Text style={styles.receiptNumber}>No: {results.id}</Text>
            </View>
            <View style={styles.headerImage}>
              <Image src={image} style={styles.logo} />
            </View>

            <View style={styles.header}>
              <Text>GREATER GRACE CHRISTIAN ACADEMY</Text>
              <Text style={styles.body}>Receipt</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Student Name:</Text>
              <Text style={styles.value}>{results.StudentName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Payment Date:</Text>
              <Text style={styles.value}>{formattedPaymentDate}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Fee Type:</Text>
              <Text style={styles.value}>{results.FeesName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Old Balance:</Text>
              <Text style={styles.value}>
                {formatCurrency(results.InitialAccountBalance)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Amount Paid:</Text>
              <Text style={styles.value}>
                {formatCurrency(results.AmountPaid)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>New Balance:</Text>
              <Text style={styles.value}>
                {formatCurrency(results.CurrentBalance)}
              </Text>
            </View>

            

            <View style={styles.row}>
              <Text style={styles.label}>Received From:</Text>
              <Text style={styles.value}>{results.ReceivedFrom}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Comment:</Text>
              <Text style={styles.value}>{results.Comment}</Text>
            </View>

            <View style={styles.notification}>
              <Text>*negative balance means the stated amount is carried forward*</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
