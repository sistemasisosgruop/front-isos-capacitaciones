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
      fontSize: 14,
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
  console.log(logo);
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Image src={logo} style={{ width: "120px", height: "50px" }} />
            </View>
            <View>
              <Text>{data.nombreEmpresa}</Text>
            </View>
          </View>
          <View style={styles.main}>
            <Text style={styles.title}>
              CONSTANCIA DE ENTREGA Y LECTURA DE RESULTADOS DE EXAMEN MEDICO
              OCUPACIONAL
            </Text>
            <View style={styles.content}>
              <Text style={[styles.paragraph2, { fontWeight: "bold" }]}>
                Yo, {data.apellidoMaterno} {data.apellidoPaterno} {data.nombres}
                , identificado (a) con DNI Nº {data.dni}, quien ocupa el cargo
                de:
                {data.cargo} mediante el presente documento dejo constancia de
                haber recibido, de manera personalizada y por parte del médico
                ocupacional de la empresa el informe médico de los resultados
                del Examen Médico Ocupacional (EMO) de tipo: Que me fue
                realizado por mi empleador EPSEMHCO S.A. en la fecha:
                {data.fecha_examen} en la clínica {data.clinica}.
              </Text>

              <Text style={styles.title2}>CONDICIÓN DE APTITUD:</Text>
              <View style={[styles.table, { marginTop: 10 }]}>
                <View style={styles.row}>
                  <View style={[styles.tableBorder1, { width: "5%" }]}>
                    <Text style={{ width: "100%", textAlign:"center" }}>
                      {data.condicion_aptitud === "APTO" ? "X" : ""}
                    </Text>
                  </View>
                  <View style={styles.tableBorder}>
                    <Text>APTO</Text>
                  </View>
                </View>
              </View>
              <View style={styles.table}>
                <View style={[styles.row, {borderColor: "red", borderWidth:1}]}>
                  <View style={[styles.tableBorder1, { width: "10%" }]}>
                    <Text style={{ width: "100%", textAlign:"center" }}>
                     
                      {data.condicion_aptitud === "APTO CON RESTRICCIONES"
                        ? "X"
                        : ""}
                    </Text>
                  </View>
                  <View style={styles.tableBorder}>
                    <Text>APTO CON RESTRICCIONES</Text>
                  </View>
                </View>
              </View>
              <View style={styles.table}>
                <View style={styles.row}>
                  <View style={[styles.tableBorder1, { width: "10%" }]}>
                    <Text style={{ width: "100%", textAlign:"center" }}>
                      
                      {data.condicion_aptitud === "NO APTO" ? "X" : ""}
                    </Text>
                  </View>
                  <View style={styles.tableBorder}>
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

            <View
              style={[
                styles.footerContainer,
                {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <View style={styles.huella}></View>
              <View style={{ marginTop: "5px" }}>
                <Text>HUELLA DIGITAL</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ConstanciaEmo;
