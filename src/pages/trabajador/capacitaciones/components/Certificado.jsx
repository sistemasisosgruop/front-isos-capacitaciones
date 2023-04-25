import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

import backgroundImage from "../../../../assets/img/fondocomprimido.jpg";
import logo from "../../../../assets/img/Nissan_logo.png";
import firma from "../../../../assets/img/firma-sello-melitza.png";

const styles = StyleSheet.create({
  page: {
    margin: 0,
    padding: 0,
  },
  container: {
    position: "relative",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "red",
    fontFamily: "Times-Roman",
  },
  logo: {
    position: "absolute",
    top: "20px",
    left: "20px",
    width: "140px",
    height: "auto",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "595px",
    zIndex: 10,
  },
  codigo: {  
    position: "absolute",
    bottom:'10px',
    right:'20px',
    textTransform:'uppercase',
    fontSize:'12pt'
  },
  main: {
    height: "595px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  submain: {
    width: "65%",
    textAlign:'center'
  },
  title: {
    fontSize: "25pt",
    textTransform: "uppercase",
    marginBottom: "15px",
  },
  otorgado: {
    fontSize: "20pt",
    marginBottom: "15px",
  },
  persona: {
    fontSize: "28pt",
    marginBottom: "15px",
    fontFamily: "Courier-Bold",
  },
  descripcion: {
    fontSize: "20pt",
    marginBottom: "15px",
    textAlign:'justify'
  },
  fecha: {
    fontSize: "20pt",
    marginBottom: "15px",
    alignSelf: "flex-end",
  },
  firma: {  
    width:"200px",
    height: "auto",
    marginLeft:'auto',
    marginRight:'auto'
  },
});

const Certificado = () => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.container}>
          <Image style={styles.background} src={backgroundImage} />
          <Image src={logo} style={styles.logo} />
          <View style={styles.main}>
            <View style={styles.submain}>
              <Text style={styles.title}>Titulo de la constancia</Text>
              <Text style={styles.otorgado}>Otorgado a:</Text>
              <Text style={styles.persona}>Luis Miguel Mendoza Aquino</Text>
              <Text style={styles.descripcion}>
                Por haber asistido al curso "
                <Text>Exposicion a riesgos fisicos y quimicos</Text>" celebrado
                el día 21 de marzo, con una duracion total de 02 horas.
              </Text>
              <Text style={styles.fecha}>Arequipa, marzo 2023</Text>
              <Image src={firma} style={styles.firma}/>
            </View>
          </View>
          <Text style={styles.codigo}>Num-cert-2023</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Certificado;
