import { faElevator } from "@fortawesome/free-solid-svg-icons";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import React from "react";

const ConstanciaEmo = ({ data, logo }) => {
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
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 30,
      paddingBottom: 20,
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
    },
    main: {
      padding: 40,
    },
    title: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 15,
    },
    title2: {
      marginTop: 20,
      fontSize: 15,
    },
    content: {
      fontSize: 12,
    },
    table: {
      fontSize: 12,
    },
    paragraph1: {
      textAlign: "justify",
      lineHeight: 1.4,
    },
    paragraph2: {
      marginTop: 20,
      textAlign: "justify",
      lineHeight: 1.6,
    },
    row: {
      flexDirection: "row",
    },
    tableBorder1: {
      flex: 0.2,
      borderWidth: 1,
      borderColor: "black",
      height: 20,
    },
    tableBorder: {
      flex: 0.5,
      borderWidth: 1,
      borderColor: "black",
      height: 20,
      justifyContent: "center",
      paddingLeft: 10,
    },
    footer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 40,
      fontSize: 10,
    },
    footerContainer: {
      flex: 1,
    },
    huella: {
      borderWidth: 1.5,
      borderColor: "black",
      height: 90,
      width: 80,
      borderRadius: "6px",
    },
  });
  // console.log(logo);
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Image src={logo} style={{ width: "100px", height: "70px" }} />
            </View>
            <View>
              <Text>{data.nombreEmpresa}</Text>
            </View>
          </View>
          <View style={styles.main}>
            <Text style={styles.title}>
              CONSTANCIA DE ENTREGA DE RESULTADOS DE EXAMEN MEDICO
              OCUPACIONAL
            </Text>
            <View style={styles.content}>
              <Text style={[styles.paragraph2, { fontWeight: "bold" }]}>
                Yo, {data.apellidoPaterno} {data.apellidoMaterno} {data.nombres}
                , identificado (a) con DNI Nº {data.dni}, quien ocupa el cargo
                de: {data.cargo} mediante el presente documento dejo constancia
                de haber recibido, de manera personalizada y por parte del
                médico ocupacional de la empresa el informe médico de los
                resultados del Examen Médico Ocupacional (EMO).
              </Text>
              <Text style={[styles.paragraph2, { fontWeight: "bold", marginTop:"10px" }]}>
                Que me fue realizado por mi empleador {data.nombreEmpresa} en la
                fecha: {data.fecha_examen} en la clínica {data.clinica}.
              </Text>

              <View style={{ marginTop: 15 }}>
                <Text style={{ fontSize: 12 }}>CONDICIÓN DE APTITUD:</Text>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "20px",
                    textAlign: "center",
                  }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "black",
                      width: "40px",
                    }}
                  >
                    <Text>
                      {data.condicion_aptitud.trim() === "APTO" ? "X" : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderLeftWidth: "none",
                      borderColor: "black",
                      width: "200px",
                      textAlign: "center",
                    }}
                  >
                    <Text>APTO</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    textAlign: "center",
                  }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "black",
                      width: "40px",
                      borderTopWidth: "none",
                    }}
                  >
                    <Text>
                      {data.condicion_aptitud.trim() ===
                      "APTO CON RESTRICCIONES"
                        ? "X"
                        : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "black",
                      width: "200px",
                      textAlign: "center",
                      borderTopWidth: "none",
                      borderLeftWidth: "none",
                    }}
                  >
                    <Text>APTO CON RESTRICCIONES</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    textAlign: "center",
                  }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "black",
                      width: "40px",
                      borderTopWidth: "none",
                    }}
                  >
                    <Text>
                      {data.condicion_aptitud.trim() === "NO APTO" ? "X" : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "black",
                      width: "200px",
                      textAlign: "center",
                      borderTopWidth: "none",
                      borderLeftWidth: "none",
                    }}
                  >
                    <Text>NO APTO</Text>
                  </View>
                </View>
              </View>
              <View>
                <Text style={styles.paragraph2}>
                  Así mismo, he sido informado(a) sobre los hallazgos, se me ha
                  indicado las recomendaciones y/o restricciones producto de
                  dicho examen médico, además se me explicó cuáles son los
                  principales riesgos laborales de mi puesto de trabajo y qué
                  acciones debo tomar para disminuir su impacto en mi salud. Por
                  otro lado, me comprometo a cumplir las recomendaciones
                  brindadas por el Médico Ocupacional respecto a mi evaluación
                  médica. Todo esto en cumplimiento de la normativa legal
                  vigente en Seguridad y Salud en el Trabajo. (Ley 29783, DS
                  005-2012 TR Y RM Nº 312-2011-MINSA). Afirmo que la información
                  contenida en el presente documento es real firmando la
                  presente .
                </Text>
              </View>
              <View style={{ marginTop: 15 }}>
                <Text>FECHA DE LECTURA: {data.fecha_lectura ? data.fecha_lectura : ''}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <View
              style={[
                styles.footerContainer,
                { display: "flex", justifyContent: "flex-end" },
              ]}
            >
              <View>
                <Text>________________________</Text>
              </View>
              <View style={{ marginTop: "5px" }}>
                <Text>FIRMA DEL TRABAJADOR</Text>
              </View>
              <View style={{ marginTop: "5px" }}>
                <Text>DNI -- {data.dni}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ConstanciaEmo;
