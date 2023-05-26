import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    margin: 0,
    padding: "10px",
  },
  main: {
    width: "100%",
  },
  dataList: {
    width: "100%",
    border: "1px solid #BACAC4",
    marginBottom: "5px",
    padding: "8px",
  },
  title: {
    fontSize: "20pt",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: "11pt",
    textTransform: "uppercase",
    marginBottom:'3px'
  },
  descripcion: {
    fontSize: "9pt",
  },
  descripcionSelect: {
    fontSize: "11pt",
    backgroundColor:'#BACAC4'
  },
});

const ExamenCapacitacion = ({ data }) => {
  if (data !== "") {
  } else {
    return <Document></Document>;
  }

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.dataList}>
              <Text style={styles.title}>{data.nombreCapacitacion}</Text>
            </View>
            <View style={styles.dataList}>
              <Text style={styles.subtitle}>DNI</Text>
              <Text style={styles.descripcion}>{`${data.trabajador?.dni}`}</Text>
            </View>
            <View style={styles.dataList}>
              <Text style={styles.subtitle}>apellidos y nombres</Text>
              <Text
                style={styles.descripcion}
              >{`${data.trabajador.apellidoPaterno} ${data.trabajador.apellidoMaterno} ${data.trabajador.nombres}`}</Text>
            </View>
            <View style={styles.dataList}>
              <Text style={styles.subtitle}>cargo</Text>
              <Text
                style={styles.descripcion}
              >{`${data.trabajador.cargo}`}</Text>
            </View>
            <View style={styles.dataList}>
              <Text style={styles.subtitle}>Empresa</Text>
              <Text style={styles.descripcion}>{`${data.nombreEmpresa}`}</Text>
            </View>
            <View style={styles.dataList}>
              <Text style={styles.subtitle}>Edad</Text>
              <Text
                style={styles.descripcion}
              >{`${data.trabajador.edad}`}</Text>
            </View>
            <View style={styles.dataList}>
              <Text style={styles.subtitle}>Sexo</Text>
              <Text
                style={styles.descripcion}
              >{`${data.trabajador.genero}`}</Text>
            </View>
            {data.preguntas.map((pregunta, index) => {
              return (
                <View key={index} style={styles.dataList}>
                  <Text style={styles.subtitle}>{pregunta.texto}</Text>
                  <Text style={pregunta.respuestaTrabajador === 1 ? styles.descripcionSelect : styles.descripcion }>
                   - {pregunta.opcion1}
                   </Text>
                  <Text style={pregunta.respuestaTrabajador === 2 ? styles.descripcionSelect : styles.descripcion }>
                   - {pregunta.opcion2}
                   </Text>
                  <Text style={pregunta.respuestaTrabajador === 3 ? styles.descripcionSelect : styles.descripcion }>
                   - {pregunta.opcion3}
                   </Text>
                  <Text style={pregunta.respuestaTrabajador === 4 ? styles.descripcionSelect : styles.descripcion }>
                   - {pregunta.opcion4}
                   </Text>
                  <Text style={pregunta.respuestaTrabajador === 5 ? styles.descripcionSelect : styles.descripcion }>
                   - {pregunta.opcion5}
                   </Text>
                </View>
              );  
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ExamenCapacitacion;
