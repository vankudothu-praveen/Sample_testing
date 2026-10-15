#include "logging/Logger.hpp"
#include <spdlog/sinks/stdout_color_sinks.h>

namespace studentrecords {
std::shared_ptr<spdlog::logger> Logger::instance() {
    static const auto logger = spdlog::stdout_color_mt("student_records");
    return logger;
}
} // namespace studentrecords
