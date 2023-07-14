import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

import backgroundImage from "../assets/img/fondocomprimido.jpg";
import logo from "../assets/img/Nissan_logo.png";
import firma from "../assets/img/firma-sello-melitza.png";

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

const Certificado = ({ data }) => {
  if (data === '') {
    return <Document></Document>;
  }
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.container}>
          <Image style={styles.background} src={data.imagenes.srcCertificado} />
          <Image src={data.imagenes.srcLogo} style={styles.logo} />
          <View style={styles.main}>
            <View style={styles.submain}>
              <Text style={styles.title}>Titulo de la constancia</Text>
              <Text style={styles.otorgado}>Otorgado a:</Text>
              <Text style={styles.persona}>{
                `${data.trabajador.apellidoPaterno} ${data.trabajador.apellidoMaterno} ${data.trabajador.nombres}`}
                </Text>
              <Text style={styles.descripcion}>
                Por haber asistido al curso "
                <Text>{data.capacitacion.nombre}</Text>" celebrado
                el día <Text>{`${data.fechaCapacitacion[0]} de ${data.fechaCapacitacion[1]}`}</Text>, con una duracion total de <Text>{data.horasCapacitacion}</Text>  horas.
              </Text>
              <Text style={styles.fecha}>Arequipa, {`${data.fechaCapacitacion[1]} ${data.fechaCapacitacion[2]}`}</Text>
              <Image src={data.imagenes.srcFirma} style={styles.firma}/>
            </View>
          </View>
          <Text style={styles.codigo}>CERT-{`${data.trabajadorId}.${data.capacitacionId}-${data.fechaCapacitacion[2]}`}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Certificado;
