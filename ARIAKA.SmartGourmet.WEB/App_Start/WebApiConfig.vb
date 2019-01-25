Imports System
Imports System.Collections.Generic
Imports System.Linq
Imports System.Web.Http
Imports Newtonsoft.Json.Serialization

Public Module WebApiConfig
    Public Sub Register(ByVal config As HttpConfiguration)
        ' Configuración y servicios de API web

        ' Rutas de API web
        config.MapHttpAttributeRoutes()

        config.Routes.MapHttpRoute(
            name:="DefaultApi",
            routeTemplate:="api/{controller}/{id}",
            defaults:=New With {.id = RouteParameter.Optional}
        )

        ' Rutas de API web
        config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = New CamelCasePropertyNamesContractResolver()
        config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(New Newtonsoft.Json.Converters.IsoDateTimeConverter() With {.DateTimeFormat = "yyyy-MM-ddTHH:mmZ"})
    End Sub
End Module