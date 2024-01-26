import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    margin: 0,
    padding: "10px",
    fontSize: "12px",
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
    fontSize: "16pt",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: "11pt",
    textTransform: "uppercase",
    marginBottom: "3px",
  },
  descripcion: {
    fontSize: "9pt",
  },
  descripcionSelect: {
    fontSize: "11pt",
    backgroundColor: "#BACAC4",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "595px",
    zIndex: 10,
  },
});

const ReporteExamenCapacitacion = ({ data, logo }) => {
  if (data !== "") {
  } else {
    return <Document></Document>;
  }
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "10px",
          }}
        >
          <Image src={logo?.srcLogo} style={{ width: "30%" }} />
        </View>

        <View style={{ padding: "20px" }}>
          {/* <View style={{marginTop:"20px"}}>
            <Text>{data?.at(-1)?.nombreEmpresa}</Text>
          </View> */}
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  border: "1px solid black",
                  width: "100%",
                  padding: "2px",
                  textAlign: "center",
                  backgroundColor: "#9cc2e6",
                  borderBottom: 0,
                  fontSize: "15px",
                }}
              >
                ASISTENCIA DE CAPACITACIÓN
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  border: "1px solid black",
                  width: "100%",
                  padding: "2px",
                  backgroundColor: "#9ce9a4",
                  borderBottom: 0,
                  fontSize: "10px",
                }}
              >
                {data?.at(-1)?.nombreCapacitacion}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  border: "1px solid black",
                  width: "5%",
                  padding: "2px",
                  textAlign: "center",
                  backgroundColor: "#ffc003",
                }}
              >
                Nro
              </Text>
              <Text
                style={{
                  border: "1px solid black",
                  width: "40%",
                  padding: "2px",
                  textAlign: "center",
                  backgroundColor: "#ffc003",
                }}
              >
                Apellidos y Nombres
              </Text>
              <Text
                style={{
                  border: "1px solid black",
                  width: "40%",
                  padding: "2px",
                  textAlign: "center",
                  backgroundColor: "#ffc003",
                }}
              >
                Capacitacion
              </Text>
              <Text
                style={{
                  border: "1px solid black",
                  width: "15%",
                  padding: "2px",
                  textAlign: "center",
                  backgroundColor: "#ffc003",
                }}
              >
                Fecha
              </Text>
            </View>

            {data?.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    fontSize: "8px",
                    textAlign: "center",
                  }}
                >
                  <Text
                    style={{
                      border: "1px solid black",
                      width: "5%",
                      padding: "2px",
                      justifyContent: "center",
                    }}
                  >
                    {index +1}
                  </Text>
                  <Text
                    style={{
                      border: "1px solid black",
                      width: "40%",
                      padding: "2px",
                    }}
                  >
                    {item?.trabajador?.apellidoPaterno.toUpperCase() +
                      " " +
                      item?.trabajador?.apellidoMaterno.toUpperCase() +
                      " " +
                      item?.trabajador?.nombres.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      border: "1px solid black",
                      width: "40%",
                      padding: "2px",
                      justifyContent: "center",
                    }}
                  >
                    {item?.trabajador?.cargo}
                  </Text>
                  <Text
                    style={{
                      border: "1px solid black",
                      width: "15%",
                      padding: "2px",
                      textAlign: "center",
                    }}
                  >
                    {item.fechaExamen}
                  </Text>

                  {/* <Text >{item?.fechaExamen}</Text> */}
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReporteExamenCapacitacion;
